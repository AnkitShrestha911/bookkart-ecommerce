import passport from "passport";
import { Strategy as GoogleStragegy, Profile } from "passport-google-oauth20";
import dotenv from "dotenv";
import { Request } from "express";
import User, { USER } from "../../models/User";

dotenv.config();

passport.use(
	new GoogleStragegy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
			callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
			passReqToCallback: true,
		},
		async (
			req: Request,
			accessToken,
			refreshToken,
			profile,
			cb: (error: any, user?: USER | false) => void
		) => {
			const { emails, displayName, photos } = profile;
			console.log("my profile", profile);
			try {
				let user = await User.findOne({ email: emails?.[0]?.value });
				if (user) {
					if (!user.profilePicture && photos?.[0]?.value) {
						user.profilePicture = photos?.[0]?.value;
						await user.save();
					}

					return cb(null, user);
				}

				user = await User.create({
					googleId: profile.id,
					name: displayName,
					email: emails?.[0]?.value,
					profilePicture: photos?.[0]?.value,
					isVerified: emails?.[0]?.verified,
					agreeTerms: true,
				});

				cb(null, user);
			} catch (err) {
				cb(err);
			}
		}
	)
);

export default passport;
