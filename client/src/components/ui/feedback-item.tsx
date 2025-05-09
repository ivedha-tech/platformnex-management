import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackItemProps {
  name: string;
  initials: string;
  rating: number;
  time: string;
  comment: string;
  category: string;
  categoryColor?: string;
}

export function FeedbackItem({
  name,
  initials,
  rating,
  time,
  comment,
  category,
  categoryColor = "bg-primary-100 text-primary-800",
}: FeedbackItemProps) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-start">
        <Avatar className="h-8 w-8 bg-primary-100 text-primary-800">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">{name}</h4>
            <span className="text-xs text-gray-500">{time}</span>
          </div>
          
          <div className="flex items-center mt-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-gray-700 ml-2">
              {rating}.0/5
            </span>
          </div>
          
          <p className="text-sm text-gray-600">{comment}</p>
          
          <div className="mt-2">
            <Badge 
              variant="outline" 
              className={cn("rounded-full font-normal px-2.5 py-1", categoryColor)}
            >
              {category}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
