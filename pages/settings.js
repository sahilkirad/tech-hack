import Layout from "@/components/Layout";

export default function Settings() {
  return (
    <Layout>
      <h1>Settings</h1>
      <div className="settings-section">
        <h2>General Settings</h2>
        {/* Form for site title, logo, etc. */}
      </div>
      <div className="settings-section">
        <h2>Payment Gateway</h2>
        {/* Payment gateway configuration form */}
      </div>
      <div className="settings-section">
        <h2>Shipping & Tax</h2>
        {/* Shipping and tax options */}
      </div>
      <div className="settings-section">
        <h2>Email Notifications</h2>
        {/* Notification preferences */}
      </div>
      {/* Add more sections as needed */}
    </Layout>
  );
}
