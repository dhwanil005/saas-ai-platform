'use client';

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const testimonials = [
    {
      "name": "John Doe",
      "avatar": "JD",
      "title": "Chief Technology Officer",
      "description": "Transformed our project delivery with its advanced AI, making us faster and more efficient."
    },
    {
      "name": "Rutvik Ravrani",
      "avatar": "RR",
      "title": "Data Analyst",
      "description": "Revolutionized data analysis with AI-driven insights. User-friendly and effective."
    },
    {
      "name": "Karan Patel",
      "avatar": "KP",
      "title": "Product Manager",
      "description": "Improved our product development with AIs predictive modeling. Scalable and supportive."
    },
    {
      "name": "Parth Patel",
      "avatar": "PP",
      "title": "Marketing Director",
      "description": "Boosted our marketing ROI with precise AI analytics. Truly a game-changer."
    },
    {
      "name": "Milind Shah",
      "avatar": "MS",
      "title": "Operations Manager",
      "description": "Streamlined our operations with AI automation. Highly recommend for efficiency."
    },
    {
      "name": "Ragnil Pate",
      "avatar": "RP",
      "title": "HR Manager",
      "description": "Transformed our hiring process with AI insights. Made recruitment smarter and faster."
    },
    {
        "name": "Meet Patel",
        "avatar": "MP",
        "title": "Software Engineer",
        "description": "Revolutionized our development process; it's intuitive and powerful."
      },
    {
        "name": "Dhwanil Shah",
        "avatar": "DS",
        "title": "Tech Lead",
        "description": "Transformed our developing strategy with AI-driven insights. A game-changer."
    }
    
  ]
  

export const LandingContent = () => {
    return (
        <div className="px-10 pb-20">
            <h2 className="text-center text-4xl text-white font-extrabold mb-10">
                Testimonials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {testimonials.map((item)=>(
                    <Card
                        key={item.description}
                        className="bg-[#192339] border-none text-white"
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-x-2">
                                <div>
                                    <p className="text-lg">
                                        {item.name}
                                    </p>
                                    <p className="text-zinc-400 text-sm">
                                        {item.title}
                                    </p>
                                </div>
                            </CardTitle>
                            <CardContent className="pt-4 px-0">
                                {item.description}
                            </CardContent>
                        </CardHeader>

                    </Card>
                ))}
            </div>
        </div>
    )
}