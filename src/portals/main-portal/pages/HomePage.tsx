import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CircleStackIcon,
  DocumentDuplicateIcon,
  HandThumbUpIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { Card } from "../../../components/ui/Card";
import { Icon } from "../../../components/ui/Icon";
import { ServiceCard } from "../../../components/shared/ServiceCard";
import financingRequestImg from "../../../assets/images/serviceCards/financing_request.png";
import housingCertificateImg from "../../../assets/images/serviceCards/housing_certificate.png";
import insuranceImg from "../../../assets/images/serviceCards/insurance.png";
import transferCertificateImg from "../../../assets/images/serviceCards/transfer_certificate.png";
import { PATHS } from "../../../router/paths";

export function HomePage() {
  const { t } = useTranslation("translation");
  const navigate = useNavigate();

  const services = useMemo(
    () => [
      {
        id: "IRREVOCABLE_TRANSFER" as const,
        title: t("admin.services.irrevocableTransfer"),
        icon: <Icon icon={DocumentDuplicateIcon} className="h-7 w-7 text-white" />,
        imageSrc: transferCertificateImg,
      },
      {
        id: "HOUSING_ATTESTATION" as const,
        title: t("admin.services.housingAttestation"),
        icon: <Icon icon={HomeIcon} className="h-7 w-7 text-white" />,
        imageSrc: housingCertificateImg,
      },
      {
        id: "INSURANCE" as const,
        title: t("admin.services.insurance"),
        icon: <Icon icon={HandThumbUpIcon} className="h-7 w-7 text-white" />,
        imageSrc: insuranceImg,
      },
      {
        id: "FINANCING_REQUEST" as const,
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
        {t("student.home.title")}
      </h2>
      <p className="mt-2 text-sm text-muted">{t("student.home.subtitle")}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <ServiceCard
            key={s.id}
            title={s.title}
            icon={s.icon}
            imageSrc={s.imageSrc}
            onSubscribe={() => {
              if (s.id === "FINANCING_REQUEST") {
                navigate(PATHS.app.financingNew);
                return;
              }
              navigate(`${PATHS.app.subscribe.root}/${s.id}`);
            }}
            buttonLabelKey="student.home.subscribe"
          />
        ))}
      </div>
    </Card>
  );
}

