
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfService = () => {
  return (
    <AppLayout>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-slate max-w-none">
          <p className="text-muted-foreground">Last updated: May 1, 2023</p>
          
          <Separator className="my-6" />
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
            <p>
              Welcome to Avante Maps ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of the Avante Maps application, website, and services (collectively, the "Service").
            </p>
            <p className="mt-4">
              By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">2. Definitions</h2>
            <p>
              <strong>Users:</strong> Individuals who access or use the Service for any purpose.
            </p>
            <p className="mt-2">
              <strong>Businesses:</strong> Entities that are listed on the Service as accepting Pi cryptocurrency.
            </p>
            <p className="mt-2">
              <strong>Content:</strong> All information, text, graphics, photos, or other materials uploaded, downloaded, or appearing on the Service.
            </p>
            <p className="mt-2">
              <strong>Pi Network:</strong> The cryptocurrency network and ecosystem associated with Pi coin.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">3. Use of the Service</h2>
            <p>
              The Service is designed to help users discover businesses that accept Pi cryptocurrency as a form of payment. We provide this information on an "as is" basis, and while we strive for accuracy, we cannot guarantee that all listings are current or accurate at all times.
            </p>
            <p className="mt-4">
              You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
              <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service.</li>
              <li>To impersonate or attempt to impersonate Avante Maps, an Avante Maps employee, another user, or any other person or entity.</li>
              <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which may harm Avante Maps or users of the Service.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">4. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
            </p>
            <p className="mt-4">
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">5. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of Avante Maps and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Avante Maps.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">6. User Content</h2>
            <p>
              Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post to the Service, including its legality, reliability, and appropriateness.
            </p>
            <p className="mt-4">
              By posting content to the Service, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the Service. You retain any and all of your rights to any content you submit, post, or display on or through the Service and you are responsible for protecting those rights.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">7. Limitation of Liability</h2>
            <p>
              In no event shall Avante Maps, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">8. Disclaimer</h2>
            <p>
              Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
            </p>
            <p className="mt-4">
              Avante Maps does not warrant that the Service will be uninterrupted or error-free, that defects will be corrected, or that the Service or the server that makes it available are free of viruses or other harmful components.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">9. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p className="mt-4">
              By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> legal@avantemaps.com<br />
              <strong>Address:</strong> 123 Pi Street, Suite 456, San Francisco, CA 94103
            </p>
          </section>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default TermsOfService;
