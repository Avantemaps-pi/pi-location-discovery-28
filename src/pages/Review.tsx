
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarIcon, ChevronLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const Review = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  
  // Mock business data - in a real app, this would be fetched from the database
  const business = {
    id: businessId || "1",
    name: "Pi Tech Hub",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop",
    category: "Technology",
    currentRating: 4.5,
    totalReviews: 42
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmitReview = () => {
    if (rating === 0) {
      toast.error("Please select a rating before submitting");
      return;
    }
    
    // In a real app, this would submit to a backend
    toast.success("Review submitted successfully!", {
      description: `You gave ${business.name} a ${rating}-star rating.`
    });
    
    // Navigate back to business page
    setTimeout(() => navigate(-1), 1500);
  };

  return (
    <AppLayout title={`Review ${business.name}`}>
      <div className="max-w-3xl mx-auto pb-8">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-md overflow-hidden">
                <img 
                  src={business.image} 
                  alt={business.name} 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'public/placeholder.svg';
                  }}
                />
              </div>
              <div>
                <CardTitle className="text-xl">{business.name}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(business.currentRating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm ml-1">{business.currentRating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground ml-1">
                      ({business.totalReviews} reviews)
                    </span>
                  </div>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <Separator />
          
          <CardContent className="pt-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Your Rating</h3>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <StarIcon
                      className={`h-8 w-8 ${
                        star <= (hoverRating || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {rating > 0 ? (
                  <span className="font-medium">
                    {rating === 5 ? "Excellent! " : rating === 4 ? "Great! " : rating === 3 ? "Good. " : rating === 2 ? "Fair. " : "Poor. "}
                    {rating === 1 
                      ? "We're sorry to hear about your experience." 
                      : rating <= 3 
                      ? "Thank you for your feedback."
                      : "We're glad you enjoyed your experience!"}
                  </span>
                ) : (
                  "Tap a star to rate"
                )}
              </p>
            </div>
            
            <div className="mb-2">
              <h3 className="text-lg font-medium mb-3">Your Review (optional)</h3>
              <Textarea
                placeholder="Share your experience with this business..."
                className="min-h-32"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2 pt-0">
            <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button onClick={handleSubmitReview}>Submit Review</Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Review;
