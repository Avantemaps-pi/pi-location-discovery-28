
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <AppLayout>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-slate max-w-none">
          <p className="text-muted-foreground">Last updated: May 1, 2023</p>
          
          <Separator className="my-6" />
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
            <p>
              Avante Maps ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy will inform you about how we look after your personal data when you visit our website or use our mobile application (collectively, the "Service") and tell you about your privacy rights and how the law protects you.
            </p>
            <p className="mt-4">
              Please read this Privacy Policy carefully before using the Service. By using the Service, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">2. The Data We Collect</h2>
            <p>
              We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this Service.</li>
              <li><strong>Usage Data</strong> includes information about how you use our Service.</li>
              <li><strong>Location Data</strong> includes your current location disclosed by GPS technology so that we can provide you with information about nearby businesses accepting Pi cryptocurrency.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">3. How We Use Your Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
            <p className="mt-4">
              Specifically, we may use your data for the following purposes:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>To register you as a new user</li>
              <li>To provide you with the services available through our Service</li>
              <li>To show you businesses accepting Pi cryptocurrency near your location</li>
              <li>To manage your account</li>
              <li>To notify you about changes to our Service</li>
              <li>To improve our Service</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">4. Data Sharing</h2>
            <p>
              We may share your personal data with the following parties:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Service Providers:</strong> We may share your personal data with service providers who perform services on our behalf, such as hosting, data analysis, payment processing, and customer service.</li>
              <li><strong>Business Partners:</strong> We may share your personal data with our business partners who offer services that may be of interest to you.</li>
              <li><strong>Legal Requirements:</strong> We may disclose your personal data where required to do so by law or in response to valid requests by public authorities.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">5. Data Security</h2>
            <p>
              We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
            </p>
            <p className="mt-4">
              We have put in place procedures to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">6. Data Retention</h2>
            <p>
              We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting, or reporting requirements.
            </p>
            <p className="mt-4">
              To determine the appropriate retention period for personal data, we consider the amount, nature, and sensitivity of the personal data, the potential risk of harm from unauthorized use or disclosure of your personal data, the purposes for which we process your personal data, and whether we can achieve those purposes through other means, and the applicable legal, regulatory, tax, accounting, or other requirements.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">7. Your Legal Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
            <p className="mt-4">
              If you wish to exercise any of these rights, please contact us using the details provided below.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">8. Third-Party Links</h2>
            <p>
              The Service may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements. When you leave our Service, we encourage you to read the privacy policy of every website you visit.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">9. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </p>
            <p className="mt-4">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> privacy@avantemaps.com<br />
              <strong>Address:</strong> 123 Pi Street, Suite 456, San Francisco, CA 94103
            </p>
          </section>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default PrivacyPolicy;
