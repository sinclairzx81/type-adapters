// ------------------------------------------------------------------
// Clean
// ------------------------------------------------------------------
export async function clean() {
  await folder('target').clean()
}
// ------------------------------------------------------------------
// Start
// ------------------------------------------------------------------
export async function start() {
  await shell('hammer run example/index.ts --dist target')
}