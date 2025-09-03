import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, CreditCard, Shield } from "lucide-react";
import React from "react";

interface PriceDetailsProps {
	totalOriginalAmount: number;
	totalAmount: number;
	totalDiscount: number;
	shippingCharge: number;
	itemCount: number;
	isProcessing: boolean;
	step: "cart" | "address" | "payment";
	onProceed: () => void;
	onBack: () => void;
}

const PriceDetails: React.FC<PriceDetailsProps> = ({
	totalAmount,
	totalDiscount,
	totalOriginalAmount,
	itemCount,
	isProcessing,
	step,
	onProceed,
	shippingCharge,
	onBack,
}) => {
	return (
		<Card className="shadow-lg">
			<CardHeader>
				<CardTitle className="text-xl font-semibold">Price Details</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex justify-between">
					<span>Price:({itemCount} items)</span>
					<span>
						<span className="text-xs mr-1">&#8377;</span>
						{totalOriginalAmount}
					</span>
				</div>
				<div className="flex justify-between text-green-600">
					<span>Discount:</span>

					<span>
						- <span className="text-xs mr-1">&#8377;</span>
						{totalDiscount}
					</span>
				</div>

				<div className={`flex justify-between ${shippingCharge === 0 ? 'text-green-600' : 'text-black'}`}>
					<span>Delivery Charge:</span>

					<span>
						{shippingCharge === 0 ? (
							"Free"
						) : (
							<span>
								<span className="text-xs mr-1">&#8377;</span>
								{shippingCharge}
							</span>
						)}
					</span>
				</div>

        <div className="flex justify-between text-black border-t-2 border-gray-300 pt-4">
					<span>Total Price:</span>

					<span>
						<span className="text-xs mr-1">&#8377;</span>
						{totalAmount}
					</span>
				</div>
			</CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg" disabled={isProcessing} onClick={onProceed}>
          {isProcessing ? ("processing...") : step === 'payment' ? (
            <>
            <CreditCard className="w-4 h-4 mr-2"/>
            Continue To Pay
            </>
          ): (
            <>
            <ChevronRight className="w-4 h-4 mr-2"/>
            {
              step === 'cart' ? 'Proceed To Checkout' : 'Proceed To Payment'
            }
            </>
          )}
        </Button>
        {
          step !== 'cart' && (
            <Button variant="outline" className="w-full" onClick={onBack}>
              <ChevronLeft className="w-4 h-4 mr-2"/>
              Go Back
            </Button>
          )
        }

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield className="w-4 h-4"/>
          <span>Safe and Secure Payments</span>

        </div>

      </CardFooter>
		</Card>
	);
};

export default PriceDetails;
