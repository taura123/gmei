import InboxClient from "./InboxClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Inbox Pesan — Dashboard Admin GMEI",
    description: "Kelola pesan masuk dari formulir kontak website.",
};

export default function InboxPage() {
    return <InboxClient />;
}
