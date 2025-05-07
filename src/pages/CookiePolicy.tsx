import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const CookiePolicy = () => {
  return (
    <AppLayout title="Cookie Policy">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 pb-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Cookie Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none py-[20px]">
            <p className="text-muted-foreground"><strong>Effective Date:</strong> April 13, 2025</p>
            
            <Separator className="my-6" />
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
              <p>
                This Cookie Policy explains how Avante Maps ("we," "our," or "us") uses cookies and similar technologies to recognize you when you visit our website or use our mobile application (collectively, the "Service"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">2. What are Cookies?</h2>
              <p>
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
              </p>
              <p className="mt-4">
                Cookies set by the website owner (in this case, Avante Maps) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">3. Why Do We Use Cookies?</h2>
              <p>
                We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Service to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Service. Third parties serve cookies through our Service for advertising, analytics, and other purposes.
              </p>
              <p className="mt-4">
                The specific types of first and third-party cookies served through our Service and the purposes they perform are described below:
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">4. Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold">Essential Cookies</h3>
                  <p>
                    These cookies are strictly necessary to provide you with services available through our Service and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the Service, you cannot refuse them without impacting how our Service functions.
                  </p>
                  <p className="mt-2">
                    Examples include cookies used to authenticate users, maintain sessions, and remember your preferences for map display and business searches.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold">Performance and Functionality Cookies</h3>
                  <p>
                    These cookies are used to enhance the performance and functionality of our Service but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.
                  </p>
                  <p className="mt-2">
                    Examples include cookies that remember your location permissions, display preferences, and recently viewed businesses.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold">Analytics and Customization Cookies</h3>
                  <p>
                    These cookies collect information that is used either in aggregate form to help us understand how our Service is being used or how effective our marketing campaigns are, or to help us customize our Service for you.
                  </p>
                  <p className="mt-2">
                    We use analytics cookies to gather information about how users interact with our maps, what businesses they view most often, and which features they use most frequently.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold">Advertising Cookies</h3>
                  <p>
                    These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in some cases selecting advertisements that are based on your interests.
                  </p>
                  <p className="mt-2">
                    We may use these cookies to promote premium business listings and to help businesses reach potential customers more effectively.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold">Social Media Cookies</h3>
                  <p>
                    These cookies are used to enable you to share pages and content that you find interesting on our Service through third-party social networking and other websites. These cookies may also be used for advertising purposes.
                  </p>
                  <p className="mt-2">
                    They help you share business information, reviews, and recommendations with your network.
                  </p>
                </div>
              </div>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">5. How Can You Control Cookies?</h2>
              <p>
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided below.
              </p>
              <p className="mt-4">
                You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our Service though your access to some functionality and areas of our Service may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser's help menu for more information.
              </p>
              <p className="mt-4">
                Most modern browsers allow you to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>View your cookies</li>
                <li>Delete specific cookies</li>
                <li>Block third party cookies</li>
                <li>Block cookies from particular sites</li>
                <li>Block all cookies</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">6. Do We Use Web Beacons?</h2>
              <p>
                Cookies are not the only way to recognize or track visitors to a website. We may use other, similar technologies from time to time, like web beacons (sometimes called "tracking pixels" or "clear gifs"). These are tiny graphics files that contain a unique identifier that enable us to recognize when someone has visited our Service or opened an e-mail that we have sent them. This allows us, for example, to monitor the traffic patterns of users from one page within our Service to another, to deliver or communicate with cookies, to understand whether you have come to our Service from an online advertisement displayed on a third-party website, to improve site performance, and to measure the success of e-mail marketing campaigns. In many instances, these technologies are reliant on cookies to function properly, and so declining cookies will impair their functioning.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">7. How Often Will We Update This Cookie Policy?</h2>
              <p>
                We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
              </p>
              <p className="mt-4">
                The date at the top of this Cookie Policy indicates when it was last updated.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-4">8. Where Can You Get Further Information?</h2>
              <p>
                If you have any questions about our use of cookies or other technologies, please email us at privacy@avantemaps.com or contact us at:
              </p>
              <p className="mt-2">
                <strong>Address:</strong> 123 Pi Street, Suite 456, San Francisco, CA 94103
              </p>
              <p className="mt-2">
                <strong>Phone:</strong> (555) 123-4567
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CookiePolicy;
