import { toast as sonnerToast } from "sonner";
import { WareFlowToast } from "@/components/ui/toast";
import type { ToastOptions, ToastVariant } from "@/components/ui/toast";

function show(variant: ToastVariant, { title, description, duration = 5000 }: ToastOptions) {
  sonnerToast.custom(
    (id) => <WareFlowToast id={id} variant={variant} title={title} description={description} />,
    { duration },
  );
}

export const toast = {
  success: (opts: ToastOptions) => show("success", opts),
  error: (opts: ToastOptions) => show("error", opts),
  warning: (opts: ToastOptions) => show("warning", opts),
  info: (opts: ToastOptions) => show("info", opts),
};
