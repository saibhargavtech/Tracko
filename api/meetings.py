from http.server import BaseHTTPRequestHandler
import json
import os
from supabase import create_client, Client

def handler(request):
    # Get environment variables
    supabase_url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
    supabase_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not supabase_key:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Missing Supabase credentials'})
        }
    
    # Initialize Supabase client
    supabase: Client = create_client(supabase_url, supabase_key)
    
    # Parse request
    method = request.get('method', 'GET')
    path = request.get('path', '')
    
    try:
        if method == 'GET':
            # Get all meetings
            response = supabase.table('meetings').select('*').order('date', desc=True).execute()
            return {
                'statusCode': 200,
                'body': json.dumps(response.data)
            }
        
        elif method == 'POST':
            # Create new meeting
            data = json.loads(request.get('body', '{}'))
            response = supabase.table('meetings').insert(data).execute()
            return {
                'statusCode': 201,
                'body': json.dumps(response.data[0] if response.data else {})
            }
        
        elif method == 'PUT':
            # Update meeting
            data = json.loads(request.get('body', '{}'))
            meeting_id = path.split('/')[-1]
            response = supabase.table('meetings').update(data).eq('id', meeting_id).execute()
            return {
                'statusCode': 200,
                'body': json.dumps(response.data[0] if response.data else {})
            }
        
        elif method == 'DELETE':
            # Delete meeting
            meeting_id = path.split('/')[-1]
            supabase.table('meetings').delete().eq('id', meeting_id).execute()
            return {
                'statusCode': 200,
                'body': json.dumps({'success': True})
            }
        
        else:
            return {
                'statusCode': 405,
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

