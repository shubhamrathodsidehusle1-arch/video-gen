import os
import time
import psycopg2
from celery import Task
from celery_app import celery_app
from datetime import datetime
import json

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:changeme@postgres:5432/vibeclip')

def get_db_connection():
    """Create a database connection"""
    return psycopg2.connect(DATABASE_URL)

def update_job_status(job_id: str, status: str, output_url: str = None, error_message: str = None):
    """Update job status in the database"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        update_fields = ['status = %s', 'updated_at = %s']
        params = [status, datetime.utcnow()]
        
        if status == 'processing' and output_url is None:
            update_fields.append('started_at = %s')
            params.append(datetime.utcnow())
        
        if status == 'completed':
            update_fields.append('completed_at = %s')
            params.append(datetime.utcnow())
            if output_url:
                update_fields.append('output_url = %s')
                params.append(output_url)
        
        if error_message:
            update_fields.append('error_message = %s')
            params.append(error_message)
        
        params.append(job_id)
        
        query = f"UPDATE jobs SET {', '.join(update_fields)} WHERE id = %s"
        cursor.execute(query, params)
        conn.commit()
        cursor.close()
    finally:
        conn.close()

def increment_retry_count(job_id: str):
    """Increment retry count for a job"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE jobs SET retry_count = retry_count + 1, updated_at = %s WHERE id = %s",
            (datetime.utcnow(), job_id)
        )
        conn.commit()
        cursor.close()
    finally:
        conn.close()

class JobTask(Task):
    """Base task class with error handling"""
    
    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """Handle task failure"""
        job_id = args[0] if args else kwargs.get('job_id')
        if job_id:
            increment_retry_count(job_id)
            update_job_status(
                job_id,
                'failed',
                error_message=str(exc)
            )

@celery_app.task(bind=True, base=JobTask, max_retries=3, default_retry_delay=60)
def process_video_generation(self, job_id: str, input_prompt: str):
    """
    Process video generation job
    This is a placeholder that simulates video generation
    In Phase 4, this will integrate with actual AI services
    """
    try:
        print(f"Processing job {job_id} with prompt: {input_prompt}")
        
        # Update status to processing
        update_job_status(job_id, 'processing')
        
        # Simulate video generation (this will be replaced with actual AI service calls)
        time.sleep(10)  # Simulate processing time
        
        # Simulate output
        output_url = f"https://storage.example.com/videos/{job_id}.mp4"
        
        # Update status to completed
        update_job_status(job_id, 'completed', output_url=output_url)
        
        print(f"Job {job_id} completed successfully")
        return {
            'job_id': job_id,
            'status': 'completed',
            'output_url': output_url
        }
        
    except Exception as exc:
        print(f"Job {job_id} failed: {str(exc)}")
        
        # Retry if not exceeded max retries
        if self.request.retries < self.max_retries:
            raise self.retry(exc=exc)
        else:
            update_job_status(
                job_id,
                'failed',
                error_message=f"Max retries exceeded: {str(exc)}"
            )
            raise

@celery_app.task
def check_provider_health():
    """
    Check health of AI providers
    This will be fully implemented in Phase 4
    """
    print("Checking provider health...")
    
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # Example: Update or insert provider health status
        providers = [
            {'name': 'openai', 'status': 'healthy', 'error_rate': 0.0},
            {'name': 'replicate', 'status': 'healthy', 'error_rate': 0.0},
        ]
        
        for provider in providers:
            cursor.execute("""
                INSERT INTO provider_health (id, provider_name, status, error_rate, last_checked, created_at, updated_at)
                VALUES (gen_random_uuid(), %s, %s, %s, %s, %s, %s)
                ON CONFLICT (provider_name) 
                DO UPDATE SET 
                    status = EXCLUDED.status,
                    error_rate = EXCLUDED.error_rate,
                    last_checked = EXCLUDED.last_checked,
                    updated_at = EXCLUDED.updated_at
            """, (
                provider['name'],
                provider['status'],
                provider['error_rate'],
                datetime.utcnow(),
                datetime.utcnow(),
                datetime.utcnow()
            ))
        
        conn.commit()
        cursor.close()
        print("Provider health check completed")
    except Exception as e:
        print(f"Provider health check failed: {str(e)}")
    finally:
        conn.close()

@celery_app.task
def cleanup_old_jobs():
    """
    Cleanup old completed/failed jobs
    """
    print("Cleaning up old jobs...")
    
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # Delete jobs older than 90 days
        cursor.execute("""
            DELETE FROM jobs 
            WHERE status IN ('completed', 'failed', 'cancelled')
            AND created_at < NOW() - INTERVAL '90 days'
        """)
        
        deleted_count = cursor.rowcount
        conn.commit()
        cursor.close()
        
        print(f"Cleaned up {deleted_count} old jobs")
        return {'deleted_count': deleted_count}
    except Exception as e:
        print(f"Cleanup failed: {str(e)}")
        raise
    finally:
        conn.close()

@celery_app.task
def send_notification(user_id: str, job_id: str, status: str):
    """
    Send notification to user about job status
    This is a placeholder for future notification implementation
    """
    print(f"Sending notification to user {user_id} for job {job_id}: {status}")
    # TODO: Implement email/push notification in later phases
    return {'user_id': user_id, 'job_id': job_id, 'status': status}

# Setup periodic tasks (optional, for scheduled tasks)
celery_app.conf.beat_schedule = {
    'check-provider-health-every-5-minutes': {
        'task': 'tasks.check_provider_health',
        'schedule': 300.0,  # 5 minutes
    },
    'cleanup-old-jobs-daily': {
        'task': 'tasks.cleanup_old_jobs',
        'schedule': 86400.0,  # 24 hours
    },
}
