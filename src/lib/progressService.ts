// let progressEvent: WritableStreamDefaultWriter<Uint8Array> | null = null;

// // Function to send progress to SSE
// export function sendProgress(progress: {
//   loaded: number | undefined;
//   total: number | undefined;
// }) {
//   if (progressEvent) {
//     const message = `data: ${JSON.stringify(progress)}\n\n`; // Format message
//     progressEvent.write(new TextEncoder().encode(message));
//   }
// }

// // Set the writer
// export function setProgressWriter(
//   writer: WritableStreamDefaultWriter<Uint8Array>
// ) {
//   progressEvent = writer;
// }

// // Clear the writer
// export function clearProgressWriter() {
//   progressEvent = null;
// }
