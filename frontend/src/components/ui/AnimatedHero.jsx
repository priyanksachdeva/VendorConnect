import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Button } from "./ButtonNew";

function AnimatedHero({ onSignUpClick }) {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["reliable", "efficient", "smart", "powerful", "connected"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  const scrollToAuth = () => {
    const authSection = document.getElementById("auth-section");
    if (authSection) {
      authSection.scrollIntoView({ behavior: "smooth" });
    }
    if (onSignUpClick) onSignUpClick();
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-20 lg:py-32 items-center justify-center flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button variant="secondary" size="sm" className="gap-4">
              🚀 Empowering Street Vendors <MoveRight className="w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div
            className="flex gap-4 flex-col"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tighter text-center font-bold">
              <span className="text-gray-900">VendorConnect is</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: -100 }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-gray-600 max-w-3xl text-center">
              Managing a street vendor business today is already tough. Avoid
              further complications by ditching outdated, tedious trade methods.
              Our goal is to streamline vendor operations, making supplier
              connections easier and faster than ever.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button size="lg" className="gap-4" onClick={scrollToAuth}>
              Get Started <MoveRight className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl w-full"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="text-center">
              <div className="text-3xl mb-3">🏪</div>
              <h3 className="font-semibold text-lg mb-2">Find Suppliers</h3>
              <p className="text-gray-600 text-sm">
                Connect with verified suppliers in your area
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="font-semibold text-lg mb-2">Manage Inventory</h3>
              <p className="text-gray-600 text-sm">
                Track your stock and get smart alerts
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-semibold text-lg mb-2">Community Support</h3>
              <p className="text-gray-600 text-sm">
                Join discussions and share experiences
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export { AnimatedHero };
