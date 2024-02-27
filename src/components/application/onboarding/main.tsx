import { Fragment, useState } from "react";
import { Step1 } from "./step1";
import { Step2 } from "./step2";
import { Step3 } from "./step3";

export interface StepProps {
  setCurrentStep: (val: number) => void;
}

export const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      description: (
        <p className="text-xs text-center text-neutral-700 my-2">
          Enter your app's URL. If you do not have one, learn how to self host{" "}
          <a
            onClick={() =>
              chrome.tabs.create({ url: "https://github.com/Meriegg/notr2" })
            }
            href="https://github.com/Meriegg/notr2"
            className="text-neutral-900 underline"
          >
            here
          </a>
        </p>
      ),
      component: <Step1 setCurrentStep={setCurrentStep} />,
    },
    {
      description: (
        <p className="text-xs text-center text-neutral-700 my-2">
          Please wait for the API verification to complete.
        </p>
      ),
      component: <Step2 setCurrentStep={setCurrentStep} />,
    },
    {
      description: (
        <p className="text-xs text-center text-neutral-700 my-2">
          Authorize your extension!
        </p>
      ),
      component: <Step3 setCurrentStep={setCurrentStep} />,
    },
  ];

  chrome.storage.local.get(["onboardingStep"], (items) => {
    if (items.currentStep > steps.length - 1) {
      setCurrentStep(0);
      return;
    }

    setCurrentStep(items.onboardingStep ?? 0);
  });

  return (
    <div className="flex flex-col w-full h-full justify-center items-center p-4">
      <p className="text-base font-semibold text-neutral-900">
        Configure your extension
      </p>

      {steps.map((step, i) => (
        <Fragment key={i}>
          {i === currentStep && (
            <>
              {step.description}
              {step.component}
            </>
          )}
        </Fragment>
      ))}
    </div>
  );
};
