import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint
 * 
 * Simple endpoint for testing network connectivity and server availability.
 * Used by the NetworkMonitor utility to verify actual connectivity.
 */
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: Date.now() 
  });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}