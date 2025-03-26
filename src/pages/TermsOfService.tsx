
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const TermsOfService = () => {
  return (
    <AppLayout title="Terms of Service">
      <div className="max-w-5xl mx-auto space-y-8 p-4 sm:p-6 animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: May 1, 2023</p>
        </div>

        <Card className="material-card">
          <CardHeader>
            <CardTitle>Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6">
                <p>
                  Welcome to Avante Maps. These Terms of Service ("Terms") govern your access to and use of the Avante Maps website, mobile application, and services (collectively, the "Service").
                </p>
                <p>
                  Please read these Terms carefully. By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use the Service.
                </p>

                <h3 className="text-lg font-medium">1. Use of Service</h3>
                <p>
                  Avante Maps provides a platform for users to find businesses that accept Pi cryptocurrency and for businesses to register and promote their acceptance of Pi as a payment method.
                </p>
                <p>
                  You may use our Service only as permitted by law and in accordance with these Terms. You agree not to misuse the Service or help anyone else do so.
                </p>

                <h3 className="text-lg font-medium">2. User Accounts</h3>
                <p>
                  When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the security of your account and for all activities that occur under your account.
                </p>
                <p>
                  We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders at our sole discretion.
                </p>

                <h3 className="text-lg font-medium">3. Business Listings</h3>
                <p>
                  If you register a business on our platform, you are responsible for ensuring that all information provided is accurate, complete, and up-to-date. We reserve the right to remove any business listing that violates these Terms or that we determine, in our sole discretion, is inappropriate.
                </p>
                <p>
                  By listing your business on our platform, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, publish, and display the information you provide for the purpose of operating and promoting the Service.
                </p>

                <h3 className="text-lg font-medium">4. Intellectual Property</h3>
                <p>
                  The Service and its original content, features, and functionality are owned by Avante Maps and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                </p>
                <p>
                  You may not duplicate, copy, or reuse any portion of the HTML/CSS, JavaScript, or visual design elements or concepts without express written permission from Avante Maps.
                </p>

                <h3 className="text-lg font-medium">5. Privacy Policy</h3>
                <p>
                  Our Privacy Policy describes how we handle the information you provide to us when you use our Service. You understand that by using the Service, you consent to the collection and use of this information as set forth in the Privacy Policy.
                </p>

                <h3 className="text-lg font-medium">6. Limitation of Liability</h3>
                <p>
                  In no event shall Avante Maps, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                </p>

                <h3 className="text-lg font-medium">7. Changes to Terms</h3>
                <p>
                  We reserve the right to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                </p>

                <h3 className="text-lg font-medium">8. Contact Us</h3>
                <p>
                  If you have any questions about these Terms, please contact us at terms@avantemaps.com.
                </p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TermsOfService;
