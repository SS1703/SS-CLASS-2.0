# Setup and checklist (free Firebase plan)

## Deploy
1. `npm i -g firebase-tools`, then `firebase login`.
2. In the project folder: `firebase deploy --only firestore:rules`.
   (`firestore.rules` already has all your old rules plus the new test and password rules.)
3. Open the teacher panel once. This moves old student passwords into the protected `secrets` collection, and removes them from the student records.
4. Open Tests. If a test shows a "Secure answers" button, press it. Do this for every older test. If students already saw a test, delete it and publish it again.

## How it works
- Students' correct answers are never sent to students. Grading happens in your browser when the teacher panel is open.
- Students see "Checking your score..." until you open the teacher panel.
- Questions and options are shuffled per student, and the answers are mapped back when grading.
- Time is checked with server time, so changing the phone clock does not help.
- Retake: in Tests, press Retake next to a student's name.

## Checklist
- Start a test, then refresh: the timer should continue.
- Submit a test, open the teacher panel: the score should appear for the student.
- Students should not be able to read other students' tests or passwords.
- A student changes their password from Home, then logs in with the new one.
- Teacher edits that student: the saved password should be the new one.
- The UPI ID in Payment settings is set, otherwise students see "Teacher has not set a UPI ID yet."
