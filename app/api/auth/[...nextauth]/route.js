import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import mongoose from 'mongoose';
import User from '@/models/User';

const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: { params: { scope: 'read:user user:email' } },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SignIn Callback');
      console.log('User:', user);
      console.log('Account:', account);
      console.log('Profile:', profile);

      if (account.provider === 'github') {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/GetMeVadapav');

        const userEmail = profile?.email || `${profile?.login}@github.com`;
        const userName = profile?.name || profile?.login;
        const userProfilePic = profile?.avatar_url;

        if (!userEmail) {
          console.error("Email not found for GitHub account.");
          throw new Error("Email not found for GitHub account.");
        }

        const existingUser = await User.findOne({ email: userEmail });
        console.log('Existing User:', existingUser);

        if (!existingUser) {
          const newUser = new User({
            email: userEmail,
            username: userName.split('@')[0],
            name: userName,
            profilepic: userProfilePic,
            coverpic: '',
          });

          await newUser.save();
          console.log('New User Created:', newUser);
          user.id = newUser._id.toString(); // Ensure id is set as string
        } else {
          console.log('User Retrieved:', existingUser);
          user.id = existingUser._id.toString(); // Ensure id is set as string
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      console.log('JWT Callback');
      console.log('Token:', token);
      console.log('User:', user);

      if (user) {
        token.id = user.id || token.id;
        token.username = user.username || token.username;
        token.email = user.email || token.email;
        token.name = user.name || token.name;
        token.profilepic = user.profilepic || token.profilepic;
      }
      return token;
    },

    async session({ session, token }) {
      console.log('Session Callback');
      console.log('Session:', session);
      console.log('Token:', token);

      session.user.username = token.username;
      session.user.id = token.id; // Ensure user ID is added
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.profilepic = token.profilepic;
      return session;
    },
  },
  
  session: {
    strategy: 'jwt',
  },
  secret: process.env.JWT_SECRET,
};

export async function GET(req, res) {
  return NextAuth(req, res, authOptions);
}

export async function POST(req, res) {
  return NextAuth(req, res, authOptions);
}
