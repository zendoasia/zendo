import KoFiButton from "@/components/modules/kofiButton";
import ArticleWrapper from "@/components/articleWrapper";
import { CheckIcon, Mail } from "lucide-react";
import Link from "next/link";

export default function KoFiPage() {
  return (
    <ArticleWrapper className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Support Me
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Help keep this project alive and growing
            </p>
          </div>

          <div className="mb-8 space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Why Support?
              </h2>
              <ul className="text-left space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <CheckIcon size="1.2rem" className="text-green-500 mr-3 flex-shrink-0" />
                  Helps me start new projects and maintain existing ones
                </li>
                <li className="flex items-center">
                  <CheckIcon size="1.2rem" className="text-green-500 mr-3 flex-shrink-0" />
                  Fund new features and improvements
                </li>
                <li className="flex items-center">
                  <CheckIcon size="1.2rem" className="text-green-500 mr-3 flex-shrink-0" />
                  Support open-source development
                </li>
                <li className="flex items-center">
                  <CheckIcon size="1.2rem" className="text-green-500 mr-3 flex-shrink-0" />
                  Invest in better tools and resources to enhance the projects I make
                </li>
              </ul>
            </div>

            <div className="text-gray-600 dark:text-gray-400">
              Your support means the world to me and helps keep my passion project running. Every
              contribution, no matter how small, makes a real difference!
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <KoFiButton username="aarushmaster" className="w-full sm:w-auto" />

            <div className="text-sm text-gray-500 dark:text-gray-400">or</div>

            <Link
              href="mailto:aarush01111@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors w-full sm:w-auto justify-center"
            >
              <Mail size="1.2rem" className="text-gray-700 dark:text-gray-300" />
              Send a Message
            </Link>
          </div>

          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            Thank you for being part of the my journey! 🙏
          </div>
        </div>
      </div>
    </ArticleWrapper>
  );
}
