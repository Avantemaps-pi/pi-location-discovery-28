
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MessageSquare, Send, MapPin, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from '@/components/ui/motion';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Message sent! We will get back to you soon.', {
        description: 'Our team will review your message and respond within 24 hours.'
      });
    }, 1000);
  };

  return (
    <AppLayout>
      <motion.div 
        className="space-y-8 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Get in Touch</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl md:text-lg">
            Have questions or feedback about Avante Maps? We'd love to hear from you and help your business grow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-2 shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Send us a message</CardTitle>
                <CardDescription className="text-base">
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="first-name" className="text-base font-medium">First Name</Label>
                      <Input 
                        id="first-name" 
                        placeholder="Enter your first name" 
                        required 
                        className="transition-all focus:border-avante-purple" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name" className="text-base font-medium">Last Name</Label>
                      <Input 
                        id="last-name" 
                        placeholder="Enter your last name" 
                        required 
                        className="transition-all focus:border-avante-purple" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email address" 
                      required 
                      className="transition-all focus:border-avante-purple" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-base font-medium">Subject</Label>
                    <Select>
                      <SelectTrigger id="subject" className="transition-all focus:border-avante-purple">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="business">Business Listing</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-base font-medium">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Enter your message here..." 
                      rows={5}
                      required
                      className="resize-none transition-all focus:border-avante-purple"
                    />
                  </div>
                
                  <CardFooter className="px-0 pt-4">
                    <Button 
                      type="submit" 
                      className="bg-avante-blue hover:bg-avante-blue/90 text-white px-8 py-6 h-auto text-base font-medium group transition-all duration-300 ease-in-out"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Send Message
                          <Send className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
                        </span>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-white to-slate-50 border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-avante-blue">Contact Information</CardTitle>
                <CardDescription className="text-base">
                  Get in touch with our team directly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div 
                  className="flex items-start group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-avante-purple/10 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-avante-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email</h3>
                    <p className="text-base text-muted-foreground mt-1">info@avantemaps.com</p>
                    <p className="text-base text-muted-foreground">support@avantemaps.com</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-avante-blue/10 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-avante-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Phone</h3>
                    <p className="text-base text-muted-foreground mt-1">+1 (555) 123-4567</p>
                    <p className="text-base text-muted-foreground">Monday - Friday, 9AM - 5PM PST</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-avante-teal/10 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-avante-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Location</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Avante Maps Headquarters<br />
                      123 Technology Drive<br />
                      San Francisco, CA 94103
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-avante-purple/10 p-3 rounded-full mr-4">
                    <MessageSquare className="h-6 w-6 text-avante-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Live Chat</h3>
                    <p className="text-base text-muted-foreground mt-1">Available on our website during business hours</p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">FAQ</CardTitle>
                <CardDescription className="text-base">
                  Frequently asked questions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div 
                  className="group cursor-pointer"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-semibold text-lg group-hover:text-avante-blue transition-colors">How can I list my business?</h3>
                  <p className="text-base text-muted-foreground mt-2">
                    Fill out our business listing form to add your Pi-accepting business to our platform.
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto mt-1 text-avante-purple font-medium group flex items-center gap-1"
                    onClick={() => window.location.href = '/registration'}
                  >
                    <span>Register your business</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </motion.div>
                
                <motion.div 
                  className="group cursor-pointer"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-semibold text-lg group-hover:text-avante-blue transition-colors">Is Avante Maps free to use?</h3>
                  <p className="text-base text-muted-foreground mt-2">
                    Yes, Avante Maps is completely free for users searching for Pi-accepting businesses.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="group cursor-pointer"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-semibold text-lg group-hover:text-avante-blue transition-colors">How do I verify a business accepts Pi?</h3>
                  <p className="text-base text-muted-foreground mt-2">
                    All businesses listed on our platform have been verified to accept Pi cryptocurrency payments.
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto mt-1 text-avante-purple font-medium group flex items-center gap-1"
                    onClick={() => window.location.href = '/verification-info'}
                  >
                    <span>Learn about verification</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default Contact;
