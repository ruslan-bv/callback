import * as functions from "firebase-functions";
import * as nodemailer from "nodemailer";
import admin from "firebase-admin";
import {DocumentSnapshot} from "firebase-functions/lib/providers/firestore";

admin.initializeApp();

interface Document {
    name: string;
    number: number;
    email: string;
    address: string;
}

const onCreateSendEmail = async (snapshot: DocumentSnapshot) => {
  const document = snapshot.data() as Document;

  const content = `<h1>Document is created</h1>
                    <p>New user: ${document.name}, 
                                  ${document.number}, 
                                  ${document.email},
                                  ${document.address}</p>`;

  try {
    const mailContent = {
      from: "info@callback.com",
      to: "ceo@callback.com",
      subject: "New Document Is Created!",
      html: content,
    };

    const transporter = nodemailer.createTransport({
      host: "mainMailProvider.com",
      port: 8080,
      secure: true,
      auth: {
        user: "info@callback.com",
        pass: "hidden",
      },
    });

    await transporter.sendMail(mailContent);
  } catch (err) {
    console.error(err);
  }
};

export const watchCreate = functions
    .firestore
    .document("documents/{docId}")
    .onCreate(onCreateSendEmail);
