# Known Issues and Workarounds

## Supabase Platform Issues

### 1. Linter Cache False Positives

**Issue**: Supabase Database Linter shows outdated security warnings after fixes are applied

**Affected Warnings**:
- SECURITY DEFINER view warnings for views that don't have SECURITY DEFINER
- May persist for hours or days after fixing

**Verification**: Run this query to check actual database state:
```sql
SELECT viewname,
       CASE WHEN definition ILIKE '%security definer%' 
            THEN 'HAS SECURITY DEFINER' 
            ELSE 'CLEAN' 
       END as actual_state
FROM pg_views
WHERE schemaname = 'public';
```

**Workaround**:
- Verify security via SQL queries (not linter)
- Document false positives
- Deploy if queries show secure state

**Status**: Reported to Supabase support

### 2. Anonymous Access Warnings

**Issue**: Linter warns about anonymous access policies

**Status**: Working as designed - required for elderly accessibility

**Mitigation**:
- Rate limiting (50 req/hour)
- IP tracking
- Automatic cleanup after 30 days

## Browser Compatibility

### localStorage in Private Mode

**Issue**: Some browsers disable localStorage in private mode

**Solution**: App detects and shows warning banner

**Fallback**: Memory-only storage with session warning

## Development Issues

### Hot Reload with Edge Functions

**Issue**: Local edge function changes require manual restart

**Workaround**: 
```bash
# Restart Supabase local when edge functions change
supabase stop
supabase start
```

### TypeScript Strict Mode

**Issue**: Some Radix UI components have type conflicts in strict mode

**Solution**: Type assertions used where necessary, tracked in code comments

## Performance Considerations

### Large Assessment Responses

**Issue**: JSONB assessment responses can grow large

**Mitigation**: 
- Automatic cleanup of old responses
- Compression for stored data
- Pagination for admin views

### Rate Limiting Overhead

**Issue**: Anonymous rate limiting adds slight latency

**Trade-off**: Security vs. performance - security prioritized

## Accessibility Testing

### Screen Reader Compatibility

**Known Limitations**:
- Some complex interactive elements need manual testing
- Voice-over on iOS requires additional configuration

**Testing Protocol**:
- Test with multiple screen readers
- Document any limitations
- Provide alternative interaction methods

## Monitoring

### False Positive Alerts

**Issue**: Security monitoring may trigger on legitimate anonymous usage spikes

**Solution**: Tune thresholds based on actual usage patterns

**Current Thresholds**:
- 20 anonymous users in 10 minutes = alert
- 40+ requests per hour per IP = warning