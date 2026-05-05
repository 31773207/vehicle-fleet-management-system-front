# Fix React Object-as-Child Error After Login

Status: In Progress

## Steps:
- [x] Create this TODO.md  
- [x] Step 1: Update `src/services/api.js` interceptor to extract error.message globally
- [ ] Step 2: cd frontend && npm install && npm run dev, test login -> dashboard  
- [ ] Step 3: If fixed, mark complete. If not, investigate hooks (useVehicles.js etc.)  
- [ ] Update any {error} renders found  

**Root cause:** Backend returns error object, frontend somewhere renders it directly in JSX.

**Next:** Restart dev server `cd frontend && npm run dev`. If error persists, ErrorBoundary will show exact component stack.

