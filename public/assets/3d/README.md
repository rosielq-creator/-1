# 3D asset delivery area

This directory is intentionally separate from the website's active image assets.
Only assets that have been approved with the exact instruction `验收通过` may be
referenced by the application.

## Expected delivery

Each approved asset is delivered as:

- `<asset-id>.glb` — web-ready binary glTF asset.
- `<asset-id>.blend` — editable Blender source, when available.
- `<asset-id>.preview.webp` — review image used before website integration.

Keep source files and previews alongside their GLB. Do not replace the existing
files in `public/assets/` until the corresponding entry in
`3d-assets.manifest.json` has `approvalStatus` set to `approved`.

## Website handoff

The website task should load the GLB from `/assets/3d/<asset-id>.glb`. Before
adding that reference, confirm the approved scale, initial rotation, and
placement in the manifest.
