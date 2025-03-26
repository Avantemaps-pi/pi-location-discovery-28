
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const PrivacyPolicy = () => {
  return (
    <AppLayout title="Privacy Policy">
      <div className="max-w-5xl mx-auto space-y-8 p-4 sm:p-6 animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: May 1, 2023</p>
        </div>

        <Card className="material-card">
          <CardHeader>
            <CardTitle>Our Commitment to Privacy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6">
                <p>
                  At Avante Maps, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our mobile application.
                </p>
                <p>
                  Please read this Privacy Policy carefully. By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
                </p>

                <h3 className="text-lg font-medium">1. Information We Collect</h3>
                <p>
                  We may collect information about you in a variety of ways. The information we may collect includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and phone number, that you voluntarily give to us when you register with the Service or when you choose to participate in various activities related to the Service.</li>
                  <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Service, such as your IP address, browser type, operating system, access times, and the pages you have viewed.</li>
                  <li><strong>Financial Data:</strong> Financial information, such as data related to your payment method, that we may collect when you purchase, order, or use the Service.</li>
                  <li><strong>Mobile Device Data:</strong> Device information, such as your mobile device ID, model, and manufacturer, and information about the location of your device, if you access the Service from a mobile device.</li>
                </ul>

                <h3 className="text-lg font-medium">2. Use of Your Information</h3>
                <p>
                  Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Create and manage your account.</li>
                  <li>Process payments and refunds.</li>
                  <li>Facilitate business registrations and transactions.</li>
                  <li>Increase the efficiency and operation of the Service.</li>
                  <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
                  <li>Notify you of updates to the Service.</li>
                  <li>Resolve disputes and troubleshoot problems.</li>
                  <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
                </ul>

                <h3 className="text-lg font-medium">3. Disclosure of Your Information</h3>
                <p>
                  We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                  <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
                  <li><strong>Business Transfers:</strong> If we or our subsidiaries are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</li>
                </ul>

                <h3 className="text-lg font-medium">4. Security of Your Information</h3>
                <p>
                  We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                </p>

                <h3 className="text-lg font-medium">5. Your Rights and Choices</h3>
                <p>
                  You may at any time review or change the information in your account by:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Logging into your account settings and updating your account.</li>
                  <li>Contacting us using the contact information provided below.</li>
                </ul>
                <p>
                  Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Use and/or comply with legal requirements.
                </p>

                <h3 className="text-lg font-medium">6. Contact Us</h3>
                <p>
                  If you have questions or comments about this Privacy Policy, please contact us at:
                </p>
                <p>
                  privacy@avantemaps.com<br />
                  Avante Maps<br />
                  123 Pi Street<br />
                  San Francisco, CA 94103
                </p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PrivacyPolicy;
