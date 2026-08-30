# Railway uploads (no volume)

Profile photos and team logos use **Railway Bucket** (S3-compatible object storage) in production.

## One-time setup

1. In Railway project **svb**, click **Create → Bucket**
2. Name it **`svb-uploads`** (must match variable references)
3. Region: **US West (sjc)** or closest to the web service
4. Deploy the staged environment change (bucket + web variable refs)

The web service already references:

- `${{svb-uploads.BUCKET}}`
- `${{svb-uploads.ACCESS_KEY_ID}}`
- `${{svb-uploads.SECRET_ACCESS_KEY}}`
- `${{svb-uploads.ENDPOINT}}`
- `${{svb-uploads.REGION}}`

Or apply the patch:

```bash
apps/web/scripts/setup-railway-upload-bucket.sh
```

## Local dev

Without bucket env vars, files save under `public/uploads/` on disk.

## How it works

- Upload APIs write to the bucket
- Images are served from `/borneo/uploads/...` (proxied by the web app)
- No Railway volume required
