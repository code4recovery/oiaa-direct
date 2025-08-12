// src/entry-wordpress.tsx
import './index.css';
import React from 'react';
import { createBrowserRouter, RouterProvider, useLoaderData } from 'react-router';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import MeetingsFiltered from './routes/meetings-filtered';
import GroupInfo from './routes/group-info';

// WordPress Debug Wrapper Component for MeetingsFiltered
function WordPressMeetingsDebugWrapper() {
  const loaderData = useLoaderData();
  
  console.log('🔍 WordPress Meetings: Using useLoaderData hook');
  console.log('🔍 WordPress Meetings: loaderData received:', loaderData);
  console.log('🔍 WordPress Meetings: loaderData type:', typeof loaderData);
  console.log('🔍 WordPress Meetings: loaderData is array:', Array.isArray(loaderData));
  console.log('🔍 WordPress Meetings: loaderData keys:', loaderData ? Object.keys(loaderData) : 'null/undefined');
  
  // Pass loaderData as props to match the expected component signature
  return React.createElement(MeetingsFiltered, { loaderData } as any);
}

// WordPress Debug Wrapper Component for GroupInfo
function WordPressGroupInfoDebugWrapper() {
  const loaderData = useLoaderData();
  
  console.log('🔍 WordPress GroupInfo: Using useLoaderData hook');
  console.log('🔍 WordPress GroupInfo: loaderData received:', loaderData);
  console.log('🔍 WordPress GroupInfo: loaderData type:', typeof loaderData);
  console.log('🔍 WordPress GroupInfo: loaderData keys:', loaderData ? Object.keys(loaderData) : 'null/undefined');
  
  // Pass loaderData as props to match the expected component signature
  return React.createElement(GroupInfo, { loaderData } as any);
}

// Explicitly export router components for WordPress
export { createBrowserRouter, RouterProvider } from 'react-router';

// Export pre-configured router
export function createMeetingsRouter(basename = '/', apiUrl?: string) {
  // Check for WordPress-specific base path configuration
  const defaultBasename = (globalThis as any).WORDPRESS_BASE_PATH || basename;
  const defaultApiUrl = apiUrl || (globalThis as any).CQ_URL || 'https://central-query.apps.code4recovery.org/api/v1/meetings';

  return createBrowserRouter([
    {
      path: "/",
      Component: WordPressMeetingsDebugWrapper,
      loader: async ({ request }) => {
        try {
          // Build query string with defaults (matching the normal clientLoader)
          const { searchParams } = new URL(request.url);
          let queryString = '';
          
          if (![...searchParams.entries()].length) {
            // Default parameters: start from now, show next 1 hour of meetings
            const now = new Date().toISOString();
            const params = new URLSearchParams({
              start: now,
              hours: "1",
            });
            queryString = `?${params.toString()}`;
          } else {
            queryString = `?${searchParams.toString()}`;
          }
          
          const apiUrl = `${defaultApiUrl}${queryString}`;
          console.log('WordPress Meetings: Fetching meetings from:', apiUrl);
          
          const response = await fetch(apiUrl);
          const data = await response.json();
          
          console.log('WordPress Meetings: Received meetings data:', data?.length || 0, 'meetings');
          
          // CRITICAL FIX: Always return { meetings } object, handle both array and object responses
          return Array.isArray(data) ? { meetings: data } : data;
        } catch (error) {
          console.error('WordPress Meetings: Failed to fetch meetings:', error);
          return { meetings: [] };
        }
      }
    },
    {
      path: "/group-info/:slug",
      Component: WordPressGroupInfoDebugWrapper,
      loader: async ({ params }) => {
        try {
          // Extract the actual meeting slug (basename-aware)
          const meetingSlug = params.slug;
          console.log('WordPress GroupInfo: Fetching data for slug:', meetingSlug);
          
          // Use the full API URL including /meetings (same as standalone app)
          console.log('WordPress GroupInfo: Base API URL:', defaultApiUrl);
          
          // Fetch meeting data - append slug to the meetings API URL
          const meetingUrl = `${defaultApiUrl}/${meetingSlug}`;
          console.log('WordPress GroupInfo: Meeting URL:', meetingUrl);
          const meetingResponse = await fetch(meetingUrl);
          const meeting = await meetingResponse.json();
          
          console.log('WordPress GroupInfo: Received meeting data:', meeting);
          
          // Fetch related group info - append slug/related-group-info to the meetings API URL
          const groupUrl = `${defaultApiUrl}/${meetingSlug}/related-group-info`;
          console.log('WordPress GroupInfo: Group URL:', groupUrl);
          const groupResponse = await fetch(groupUrl);
          const group = await groupResponse.json();
          
          console.log('WordPress GroupInfo: Received group data:', group);
          
          return { meeting, group };
        } catch (error) {
          console.error('WordPress GroupInfo: Failed to fetch data:', error);
          throw new Response('Group not found', { status: 404 });
        }
      }
    }
  ], { 
    basename: defaultBasename,
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  });
}

// WordPress-ready component with proper ChakraProvider
export default function WordPressMeetings({ basename = '/', apiUrl }: { basename?: string; apiUrl?: string } = {}) {
  const router = createMeetingsRouter(basename, apiUrl);
  
  // Wrap with ChakraProvider using defaultSystem to fix "_config is undefined" error
  return React.createElement(
    ChakraProvider,
    { value: defaultSystem, children: React.createElement(RouterProvider, { router }) }
  );
}

// WordPress-friendly helper function
export function renderWordPressMeetings(
  container: HTMLElement,
  opts?: { basename?: string; apiUrl?: string }
) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const basename = opts?.basename ?? ((globalThis as any).WORDPRESS_BASE_PATH ?? '/meetings');
  const apiUrl = opts?.apiUrl ?? ((globalThis as any).CQ_URL ?? 'https://central-query.apps.code4recovery.org/api/v1/meetings');
  
  // Ensure React and ReactDOM are available
  if (typeof React === 'undefined') {
    throw new Error('React must be available globally');
  }
  
  // Access ReactDOM from global scope (WordPress provides it)
  const ReactDOM = (globalThis as any).ReactDOM;
  if (!ReactDOM?.createRoot) {
    throw new Error('ReactDOM with createRoot must be available globally');
  }

  const root = ReactDOM.createRoot(container);
  
  // Create router with proper loader
  const router = createMeetingsRouter(basename, apiUrl);
  
  // Render with proper ChakraProvider using defaultSystem
  const element = React.createElement(
    ChakraProvider,
    { value: defaultSystem, children: React.createElement(RouterProvider, { router }) }
  );
  
  root.render(element);
  
  return {
    unmount: () => root.unmount(),
    update: (newOpts?: { basename?: string; apiUrl?: string }) => {
      const newElement = React.createElement(WordPressMeetings, { 
        basename: newOpts?.basename ?? basename, 
        apiUrl: newOpts?.apiUrl ?? apiUrl 
      } as any);
      root.render(newElement);
    }
  };
}

// Export the components directly
export { default as MeetingsFiltered } from './routes/meetings-filtered';
export { default as GroupInfo } from './routes/group-info';