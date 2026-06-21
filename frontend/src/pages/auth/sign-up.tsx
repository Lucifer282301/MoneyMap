import SignUpForm from "./_component/signup-form";
import Logo from "@/components/logo/logo";
import dashboardImg from "../../assets/images/dashboard_.png";
import dashboardImgDark from "../../assets/images/dashboard_dark.png";
import { useTheme } from "@/context/theme-provider";

const SignUp = () => {
  const { theme } = useTheme();
  return (
    <div className="grid h-screen overflow-hidden lg:grid-cols-2">
      {/* Left Section */}
      <div className="flex flex-col h-screen overflow-y-auto scrollbar-hide px-4 md:px-6 lg:px-8 py-6 bg-background">
        <div className="w-full flex-shrink-0 flex items-center justify-center lg:justify-start">
          <Logo url="/" />
        </div>
        <div className="flex flex-1 items-center justify-center py-6">
          <div className="w-full max-w-lg overflow-y-auto">
            <SignUpForm />
          </div>
        </div>
      </div>
      {/* Right Section */}
      <div className="hidden lg:flex flex-col bg-background px-4 md:px-6 lg:px-8 pt-6 overflow-hidden">
        {/* Header Content */}
        <div className="w-full">
          <h1 className="text-4xl font-bold leading-tight text-gray-900 dark:text-white">
            Hi, I'm your AI-powered personal finance app, MoneyMap!
          </h1>

          <p className="mt-4 text-lg text-gray-600 dark:text-muted-foreground">
            MoneyMap provides insights, monthly reports, CSV import, recurring
            transactions, all powered by advanced AI technology. 🚀
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="flex-1 min-h-0 w-full mt-6 overflow-hidden rounded-lg">
          <img
            src={theme === "dark" ? dashboardImgDark : dashboardImg}
            alt="Dashboard"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
