# CollegePhish: Crowdsourced phishing detection tool

[Check it out live](https://collegephish.lape.io), but please bear in mind there's not a lot of data in the phish database at the moment.

<img width="700" alt="Screenshot 2020-11-16 at 21 27 12" src="https://user-images.githubusercontent.com/22844059/99310157-80e73f00-2852-11eb-9b6b-1581290cd97e.png">

### What it is

College Phish leverages historical and user submitted data to advise people on the credibility of their emails, and protects them against scammers.

### What it does

The App behaves as follows:

-   Users copy and paste the content and the sender of a suspicious email they have received on College Phish.
-   The user submission is checked against an existing database of known phishes, curated by the educational insitution's IT admins. Then: - If user submission matches a known phish, a similarity score is returned, and the user is advised on the likelihood that the email they have received is a phish (very high/high/low). - If there aren't any similar known phishes, the user can then check whether any other people have received a similar email. A similarity score is also returned.
-   The app also checks whether that sender has previously been flagged by IT admins or other users as a potential scammer/spammer.

All new user submissions are sent to the user submissions' database. The IT admins can further investigate those emails, and, if needed, add them to the database of confirmed phishes.

<img width="700" alt="Screenshot 2020-11-16 at 21 26 25" src="https://user-images.githubusercontent.com/22844059/99310243-a116fe00-2852-11eb-8c2e-f6f4fe20d80d.png">

### The tech

The client was built with React, and the api with express.js + Firebase Cloud Functions. For computing the similarity score, Dice's Coefficient is used, which the `similarity-score` npm package implements.
