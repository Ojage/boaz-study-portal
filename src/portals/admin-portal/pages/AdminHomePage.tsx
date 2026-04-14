import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../../../components/ui/Card";
import { Icon } from "../../../components/ui/Icon";
import financingRequestImg from "../../../assets/images/serviceCards/financing_request.png";
import housingCertificateImg from "../../../assets/images/serviceCards/housing_certificate.png";
import insuranceImg from "../../../assets/images/serviceCards/insurance.png";
import transferCertificateImg from "../../../assets/images/serviceCards/transfer_certificate.png";
import {
  CircleStackIcon,
  DocumentDuplicateIcon,
  HandThumbUpIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { ServiceCard } from "../components/ServiceCard";

export function AdminHomePage() {
  const { t } = useTranslation("translation");

  const services = useMemo(
    () => [
      {
        title: t("admin.services.irrevocableTransfer"),
        icon: <Icon icon={DocumentDuplicateIcon} className="h-7 w-7 text-white" />,
        imageSrc: transferCertificateImg,
      },
      {
        title: t("admin.services.housingAttestation"),
        icon: <Icon icon={HomeIcon} className="h-7 w-7 text-white" />,
        imageSrc: housingCertificateImg,
      },
      {
        title: t("admin.services.insurance"),
        icon: <Icon icon={HandThumbUpIcon} className="h-7 w-7 text-white" />,
        imageSrc: insuranceImg,
      },
      {
        title: t("admin.services.financingRequest"),
        icon: <Icon icon={CircleStackIcon} className="h-7 w-7 text-white" />,
        imageSrc: financingRequestImg,
      },
    ],
    [t],
  );

  return (
    <Card className="p-5 md:p-6">
      <h2 className="text-lg font-bold text-[color:var(--primary)]">
        {t("admin.services.title")}
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <ServiceCard key={s.title} title={s.title} icon={s.icon} imageSrc={s.imageSrc} />
        ))}
      </div>
    </Card>
  );
}
