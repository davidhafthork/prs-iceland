# PRS Debug Investigation

You are investigating an issue in PRS Iceland. Follow these steps systematically:

## Investigation Steps

1. **Gather Context**
   - What is the reported issue?
   - When did it start happening?
   - Which component/feature is affected?

2. **Check Common Areas**
   - For registration issues: Check /debug route
   - For database issues: Check /test route
   - For admin issues: Verify at /admin with password
   - For display issues: Check browser console

3. **Deep Dive**
   - Search git log for recent changes in affected areas
   - Check Supabase RLS policies if database-related
   - Review error handling in relevant components
   - Look for edge cases in data handling

4. **Root Cause Analysis**
   - Identify the specific code causing the issue
   - Determine why it's failing
   - Check if similar patterns exist elsewhere

5. **Solution**
   - Propose minimal fix that addresses root cause
   - Consider impact on other features
   - Include any necessary data migrations

## Output Format
```
Issue Summary: [Brief description]
Root Cause: [Specific technical reason]
Affected Components: [List files/features]
Proposed Fix: [Minimal solution]
Testing Steps: [How to verify fix works]
```

Always prioritize production stability over complex solutions.