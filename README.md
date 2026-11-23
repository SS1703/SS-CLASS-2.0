# SS Class 2.0

A web app for tuition classes: live classes, recordings, study material, tests, and fee tracking. Built with Firebase (Auth, Firestore, Cloud Messaging).

## Files
- `index.html`: the whole app (student and teacher views).
- `firestore.rules`: database security rules. Deploy with `firebase deploy --only firestore:rules`.
- `send-due.js` and `.github/workflows/monthly-due.yml`: monthly fee reminder (GitHub Actions).
- `sw.js`, `manifest.webmanifest`: offline caching and home-screen install.
- `SETUP-TESTS.md`: test setup and checklist.

## Notes
- Student passwords are stored in the `secrets` collection, readable only by the teacher.
- Correct test answers are stored in `classes/{class}/tests/{test}/key/answers`, readable only by the teacher.
- Tests are graded in the teacher's browser when the teacher panel is open.
