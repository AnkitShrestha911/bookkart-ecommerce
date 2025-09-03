import {
	BookOpen,
	Camera,
	CreditCard,
	Library,
	Search,
	Store,
	Tag,
	Truck,
	User,
	Wallet,
} from "lucide-react";

export const bannerImages = ["/images/book1.jpg", "/images/book2.jpg", "/images/book3.jpg"];

export const blogPosts = [
		{
			imageSrc:
				"https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b25saW5lJTIwc2VsbCUyMGJvb2tzfGVufDB8fDB8fHww",
			title: "Where and how to sell old books online?",
			description:
				"Get started with selling your used books online and earn money from your old books.",
			icon: <BookOpen className="w-6 h-6 text-primary" />,
		},
		{
			imageSrc:
				"https://media.istockphoto.com/id/910384920/photo/kid-reading-near-locked-door.webp?a=1&b=1&s=612x612&w=0&k=20&c=J3FL4ZVORItw_bkLzlVo4WO-xUy22S7Qqbuq2xusNnc=",
			title: "What to do with old books?",
			description:
				"Learn about different ways to make use of your old books and get value from them.",
			icon: <Library className="w-6 h-6 text-primary" />,
		},
		{
			imageSrc:
				"https://images.unsplash.com/photo-1492539438225-2666b2a98f93?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG9sZCUyMCUyMGJvb2tzfGVufDB8fDB8fHww",
			title: "What is BookKart?",
			description: "Discover how BookKart helps you buy and sell used books online easily.",
			icon: <Store className="w-6 h-6 text-primary" />,
		},
	];

	export const sellSteps = [
		{
			step: "Step 1",
			title: "Post an ad for selling used books",
			description:
				"Post an ad on BookKart describing your book details to sell your old books online.",
			icon: <Camera className="h-8 w-8 text-primary" />,
		},
		{
			step: "Step 2",
			title: "Set the selling price for your books",
			description: "Set the price for your books at which you want to sell them.",
			icon: <Tag className="h-8 w-8 text-primary" />,
		},
		{
			step: "Step 3",
			title: "Get paid into your UPI/Bank account",
			description:
				"You will get money into your account once you receive an order for your book.",
			icon: <Wallet className="h-8 w-8 text-primary" />,
		},
	];

	export const buySteps = [
		{
			step: "Step 1",
			title: "Select the used books you want",
			description: "Search from over thousands of used books listed on BookKart.",
			icon: <Search className="h-8 w-8 text-primary" />,
		},
		{
			step: "Step 2",
			title: "Place the order by making payment",
			description: "Then simply place the order by clicking on the 'Buy Now' button.",
			icon: <CreditCard className="h-8 w-8 text-primary" />,
		},
		{
			step: "Step 3",
			title: "Get the books delivered at your doorstep",
			description: "The books will be delivered to you at your doorstep!",
			icon: <Truck className="h-8 w-8 text-primary" />,
		},
	];

	export const books = [
    {
      _id: "1",
      images: [],
      title: "The Alchemist",
      category: "Reading Books (Novels)",
      condition: "Excellent",
      classType: "B.Com",
      subject: "Fiction",
      price: 300,
      author: "Paulo Coelho",
      edition: "25th Anniversary Edition",
      description: "A philosophical book about a shepherd's journey to realize his dreams.",
      finalPrice: 250,
      shippingCharge: 50,
      paymentMode: "UPI",
      paymentDetails: {
        upiId: "example@upi"
      },
      createdAt: new Date("2025-01-01"),
      seller: { name: "John Doe", contact: "1234567890" }
    },
    {
      _id: "2",
      images: [],
      title: "7 Habits of Highly Effective People",
      category: "Reading Books (Business)",
      condition: "Good",
      classType: "MBA",
      subject: "Self-Help",
      price: 500,
      author: "Stephen R. Covey",
      edition: "30th Anniversary Edition",
      description: "A guide to personal and professional effectiveness.",
      finalPrice: 450,
      shippingCharge: 30,
      paymentMode: "Bank Account",
      paymentDetails: {
        bankDetails: {
          accountNumber: "1234567890123456",
          ifscCode: "ABC1234567",
          bankName: "XYZ Bank"
        }
      },
      createdAt: new Date("2025-01-02"),
      seller: { name: "Jane Smith", contact: "0987654321" }
    },
    {
      _id: "3",
      images: [],
      title: "Ignited Minds",
      category: "Reading Books (Motivation)",
      condition: "Fair",
      classType: "B.Tech",
      subject: "Inspiration",
      price: 400,
      author: "APJ Abdul Kalam",
      edition: "1st Edition",
      description: "An inspiring book aimed at the youth of India.",
      finalPrice: 350,
      shippingCharge: 40,
      paymentMode: "UPI",
      paymentDetails: {
        upiId: "kalam@upi"
      },
      createdAt: new Date("2025-01-03"),
      seller: { name: "Rahul Gupta", contact: "1122334455" }
    },
    {
      _id: "4",
      images: [],
      title: "Introduction to Algorithms",
      category: "College Books (Higher Education Textbooks)",
      condition: "Excellent",
      classType: "M.Tech",
      subject: "Computer Science",
      price: 1200,
      author: "Thomas H. Cormen et al.",
      edition: "3rd Edition",
      description: "A comprehensive introduction to algorithms.",
      finalPrice: 1100,
      shippingCharge: 60,
      paymentMode: "Bank Account",
      paymentDetails: {
        bankDetails:
        {
          accountNumber:"6543210987654321", 
          ifscCode:"XYZ9876543", 
          bankName:"ABC Bank"
        }
       },
       createdAt:new Date("2025-01-04"),
       seller:{name:"Alice Brown", contact:"2233445566"}
     },
     {
       _id:"5", 
       images: [],
       title:"Data Structures and Algorithms Made Easy", 
       category:"College Books (Higher Education Textbooks)", 
       condition:"Good", 
       classType:"B.Sc", 
       subject:"Computer Science", 
       price :800, 
       author:"Narasimha Karumanchi", 
       edition:"2nd Edition", 
       description:"A comprehensive guide to data structures and algorithms.", 
       finalPrice :700, 
       shippingCharge :50, 
       paymentMode :"UPI", 
       paymentDetails :{upiId :"data.structures@upi"}, 
       createdAt :new Date("2025-01-05"), 
       seller :{name :"Michael Johnson", contact :"3344556677"}
     },
     {
       _id:"6", 
       images: [],
       title:"The Great Gatsby", 
       category:"Reading Books (Novels)", 
       condition:"Excellent", 
       classType:"12th", 
       subject:"Literature", 
       price :450, 
       author :"F. Scott Fitzgerald", 
       edition :"New Edition", 
       description :"A classic novel exploring themes of wealth and society.", 
       finalPrice :400, 
       shippingCharge :20, 
       paymentMode :"Bank Account", 
       paymentDetails :{bankDetails :{accountNumber :"7890123456789012", ifscCode :"LMN4567890", bankName :"DEF Bank"}}, 
       createdAt :new Date("2024-01-06"), 
       seller :{name :"Emily Davis", contact :"4455667788"}
     },
     {
        _id:"7", 
        images: [],
        title:"Thinking, Fast and Slow",  
        category:"Reading Books (Psychology)",  
        condition:"Good",  
        classType:"MBA",  
        subject:"Psychology",  
        price :600,  
        author :"Daniel Kahneman",  
        edition :"1st Edition",  
        description :"An exploration of how we think and make decisions.",  
        finalPrice :550,  
        shippingCharge :25,  
        paymentMode :"UPI",  
        paymentDetails :{upiId :"thinking.fast@upi"},  
        createdAt :new Date("2024-01-07"),  
        seller :{name :"Sarah Wilson", contact :"5566778899"}
     },
     {
         _id:"8",  
         images: [],
         title:"The Catcher in the Rye",  
         category:"Reading Books (Novels)",  
         condition:"Fair",  
         classType:"11th",  
         subject:"Literature",  
         price :350,  
         author :"J.D. Salinger",  
         edition :"Revised Edition",  
         description :"A novel about teenage rebellion and alienation.",  
         finalPrice :300,  
         shippingCharge :15,  
         paymentMode :"Bank Account",  
         paymentDetails :{bankDetails :{accountNumber :"1234567890123456" , ifscCode :"OPQ1234567" , bankName :"GHI Bank"}},   
         createdAt :new Date("2024-01-08"),   
         seller :{name :"David Lee" , contact :"6677889900"}
     },
     {
         _id:"9" ,   
         images: [],
         title:"Becoming" ,   
         category:"Reading Books (Biography)" ,   
         condition:"Excellent" ,   
         classType:"MBA" ,   
         subject:"Biography" ,   
         price :500 ,   
         author :"Michelle Obama" ,   
         edition :"1st Edition" ,   
         description :"The memoir of the former First Lady of the United States." ,   
         finalPrice :450 ,   
         shippingCharge :20 ,   
         paymentMode :"UPI" ,   
         paymentDetails :{upiId :"becoming@upi"} ,    
         createdAt :new Date("2024-01-09") ,    
         seller :{name :"Laura Green" , contact :"7788990011"}
     },
     {
          _id:"10" ,    
          images: [],
          title:"Sapiens" ,    
          category:"Reading Books (History)" ,    
          condition:"Good" ,    
          classType:"Ph.D" ,    
          subject:"History" ,    
          price :700 ,    
          author :"Yuval Noah Harari" ,    
          edition :"1st Edition" ,    
          description :"A brief history of humankind." ,    
          finalPrice :650 ,    
          shippingCharge :35 ,    
          paymentMode :"Bank Account" ,    
          paymentDetails :{bankDetails:{accountNumber :"2345678901234567" , ifscCode :"RST9876543" , bankName :"JKL Bank"}},     
          createdAt:new Date("2024-01-10") ,
          seller:{name:"Chris Brown" , contact:"8899001122"}
     }
  ];
  
  export const filters = {
    condition: ["Excellent", "Good", "Fair"],
    category: [
      "College Books (Higher Education Textbooks)",
      "Exam/Test Preparation Books",
      "Reading Books (Novels, Children, Business, Literature, History, etc.)",
      "School Books (up to 12th)",
    ],
    classType: [
      "B.Tech",
      "B.Sc",
      "B.Com",
      "BCA",
      "MBA",
      "M.Tech",
      "M.Sc",
      "Ph.D",
      "12th",
      "11th",
      "10th",
      "9th",
      "8th",
      "7th",
      "6th",
      "5th",
    ],
  };

export const PlatformWorking = [
  {
    step: "Step 1",
    title: "Seller posts an Ad",
    description:
      "Seller posts an ad on book kart to sell their used books.",
    image: { src: "/icons/ads.png", alt: "Post Ad" },
  },
  {
    step: "Step 2",
    title: "Buyer Pays Online",
    description:
      "Buyer makes an online payment to book kart to buy those books.",
    image: { src: "/icons/pay_online.png", alt: "Payment" },
  },
  {
    step: "Step 3",
    title: "Seller ships the books",
    description: "Seller then ships the books to the buyer",
    image: { src: "/icons/fast-delivery.png", alt: "Shipping" },
  },
]

export const accountNavigation = [
  {
    title: "My Profile",
    href: "/account/profile",
    icon: User,
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "My Order",
    href: "/account/orders",
    icon: User,
    color: "from-orange-500 to-amber-500",
  },
  {
    title: "Selling Products",
    href: "/account/selling-products",
    icon: User,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "My Wishlist",
    href: "/account/wishlists",
    icon: User,
    color: "from-pink-500 to-rose-500",
  },
];