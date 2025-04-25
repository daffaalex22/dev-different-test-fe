# 🧪 Full-Stack React Test – To-Do List

## ✅ Authentication

- [x] Create a new project in [Supabase](https://supabase.com/)
- [x] Configure the database and obtain the necessary API keys
- [x] Define a `users` table in Supabase to store user information
- [x] Integrate Supabase’s magic link authentication for user login
- [x] Ensure users receive a magic link via email to authenticate
- [ ] Enable Row-Level Security (RLS) on the `users` table
- [ ] Set policies to ensure users can only access their own data

## 🗺️ Map and Markers

- [x] Obtain a Google Maps API key
- [x] Integrate Google Maps into the Next.js app
- [x] Render a map component centered on a default location
- [ ] Implement marker CRUD functionality:
  - [ ] Allow users to add markers to the map
  - [ ] Enable users to edit existing markers
  - [ ] Provide functionality to delete markers
- [ ] Ensure markers are linked to the authenticated user
- [ ] Implement RLS policies so users can only access their own markers

## 📝 CRUD Functionality

- [ ] Define the schema for marker data in Supabase (e.g., latitude, longitude, description)
- [ ] Allow users to add new markers and save them in Supabase
- [ ] Fetch and display markers associated with the authenticated user
- [ ] Enable users to edit marker details and update them in Supabase
- [ ] Provide functionality for users to delete their markers

## 🎨 Styling

- [x] Choose a UI library for styling (e.g., [shadcn/ui](https://ui.shadcn.com/))
- [x] Use `npx shadcn@latest add login-03` to scaffold the login component
- [ ] Style the map component for better user experience
  - [ ] Adjust the marker's image and price position on hover
- [ ] Make the app responsive for different screen sizes

## 🚀 Deployment & Testing

- [ ] Configure environment variables for Supabase and Google Maps API
- [ ] Ensure the app runs correctly in the development environment
- [ ] Write tests for authentication flows
- [ ] Write tests for CRUD marker operations
- [ ] Validate map interactions and marker functionalities
- [ ] Choose a hosting platform (e.g., Vercel) for deployment
- [ ] Deploy the app and confirm features work in production
- [ ] Set up monitoring tools to track performance
- [ ] Debug any post-deployment issues
