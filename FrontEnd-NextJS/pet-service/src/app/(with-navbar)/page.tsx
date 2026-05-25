"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors,
  Bath,
  Timer,
  Sparkles,
  Shield,
  Star,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";

import BenefitCard from "@/components/ui/BenefitCard";
import ServiceCard from "@/components/ui/ServiceCard";
import HeroCard from "@/components/layout/HeroCard";
import IntroCard from "@/components/layout/IntroCard";
import StepsAppointment from "@/components/layout/StepsAppointment";

import CTA from "@/components/ui/CTA";
import { useServices } from "@/hooks/services-hook";

import { handleError } from "@/apiServices/services";
import { IService, ServiceType } from "@/types/back-end";
import LoadingScreen from "@/components/ui/LoadingScreen";

import PriceRow from "@/components/layout/PriceRow";
import Link from "next/link";

export default function Home() {
  const {
    data: listServices,
    isLoading,
    isError,
    error,
  } = useServices({ current: 1, pageSize: 6 });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (isError) {
      handleError(error);
    }
  }, [isError, error]);

  const iconOf = (t: ServiceType) => {
    switch (t) {
      case ServiceType.BATH:
        return <Bath className="size-5" />;
      case ServiceType.GROOMING:
        return <Scissors className="size-5" />;
      case ServiceType.HOTEL:
        return <Star className="size-5" />;
      default:
        return <Sparkles className="size-5" />;
    }
  };

  return (
    <>
      {/* HERO */}

      <HeroCard />

      {/* INTRO CARD */}
      <IntroCard />
      <h2 className="mx-auto mt-10 max-w-6xl text-3xl xl:text-5xl px-4 py-10 ">
        Các dịch vụ trong hệ thống:
      </h2>
      {/* benefit */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          <motion.div
            initial={{ y: 100 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <BenefitCard
              icon={<Shield className="size-6" />}
              title="An toàn & vệ sinh"
              desc="Dụng cụ khử trùng, quy trình chuẩn – đảm bảo boss luôn sạch sẽ và khỏe mạnh."
            />
          </motion.div>

          <motion.div
            initial={{ y: 100 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <BenefitCard
              icon={<Timer className="size-6" />}
              title="Nhanh chóng"
              desc="Chọn dịch vụ, đặt lịch trong 30 giây – nhận xác nhận ngay lập tức."
            />
          </motion.div>
          <motion.div
            initial={{ y: 100 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {" "}
            <BenefitCard
              icon={<Sparkles className="size-6" />}
              title="Chất lượng cao"
              desc="Sản phẩm tắm & ủ dưỡng chọn lọc, phù hợp nhiều loại lông/da, các loại chó mèo."
            />
          </motion.div>
        </div>
      </section>

      {/* FEATURED SERVICES GRID */}
      <section className="max-w-6xl mx-auto px-4 ">
        <h3 className="text-2xl md:text-3xl font-bold mb-6">Dịch vụ nổi bật</h3>
        <div className="grid sm:grid-cols-2  lg:grid-cols-4 gap-4">
          {isLoading ? (
            <div className="col-span-3">
              {" "}
              <LoadingScreen />{" "}
            </div>
          ) : !listServices?.result?.length ? (
            FALLBACK_SERVICE_INTROS.map((service, index) => (
              <motion.article
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                key={service.title}
                className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-5"
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-black/80 text-white px-3 py-1 text-xs">
                  {service.icon}
                  <span>{service.badge}</span>
                </div>
                <h4 className="mt-3 text-lg font-semibold">{service.title}</h4>
                <p className="mt-2 text-sm text-black/70 dark:text-white/70">
                  {service.desc}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-black/80 dark:text-white/80">
                  {service.highlights.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </motion.article>
            ))
          ) : (
            (
              [
                ServiceType.BATH,
                ServiceType.GROOMING,
                ServiceType.HOTEL,
                ServiceType.OTHER,
              ] as const
            ).map((type: ServiceType) => {
              const services = listServices.result;
              const service = services.find(
                (item: IService) => item.type == type,
              );
              if (!service) return null;
              return (
                <motion.div
                  initial={{ y: 100 }}
                  whileInView={{
                    y: 0,
                    transition: { duration: 1, delay: 0.2 },
                  }}
                  viewport={{ once: true }}
                  key={service._id}
                  whileHover={{ scale: 1.05 }}
                >
                  <ServiceCard
                    _id={service._id}
                    img={service.picture}
                    title={service.name}
                    priceStart={
                      service.priceStart.toLocaleString("vi-VN") + "đ"
                    }
                    priceEnd={service.priceEnd.toLocaleString() + "đ"}
                    items={service.description}
                    icon={iconOf(service.type)}
                  />
                </motion.div>
              );
            })
          )}
          <Link
            href={"/services"}
            className="col-span-full flex justify-center items-center mt-2 hover:underline"
          >
            <span className="text-center">Xem tất cả</span>
          </Link>
        </div>
      </section>

      {/* BOOKING STEPS */}
      <StepsAppointment />

      {/* PRICING STRIP */}
      <section className="bg-gradient-to-r from-primary-light/20 via-transparent to-primary-dark/20 dark:from-primary-dark/30 dark:via-black dark:to-primary-light/20 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            Bảng giá nhanh
          </h3>
          <motion.div
            initial={{ filter: "blur(20px)" }}
            whileInView={{
              filter: "none",
              transition: { duration: 0.3, delay: 0.2 },
            }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {listServices &&
              listServices.result &&
              listServices.result.map((service: IService) => (
                <motion.article whileHover={{ scale: 1.02 }} key={service._id}>
                  {" "}
                  <PriceRow
                    name={service.name}
                    priceStart={
                      service.priceStart.toLocaleString("vi-VN") + "đ"
                    }
                    priceEnd={service.priceEnd.toLocaleString("vi-VN") + "đ"}
                  />
                </motion.article>
              ))}
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {/* <section className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl md:text-3xl font-bold mb-8">
          Khách hàng nói gì?
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <Testi
            name="Ngọc Anh"
            text="Dịch vụ nhanh, staff thân thiện. Boss mình sạch thơm cả tuần!"
          />
          <Testi
            name="Trung Kiên"
            text="Tỉa lông poodle rất đẹp, tạo kiểu đúng ý. Sẽ quay lại."
          />
          <Testi
            name="Quỳnh Nhi"
            text="Spa thư giãn xịn, bé đỡ stress, lông mượt lên rõ."
          />
        </div>
      </section> */}

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Câu hỏi thường gặp
        </h3>
        <div className="divide-y divide-black/10 dark:divide-white/10 rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden">
          {FAQS.map((f, i) => (
            <button
              key={f.q}
              onClick={() => setOpenFaq((o) => (o === i ? null : i))}
              className="w-full text-left px-4 py-4 bg-background-light/40 dark:bg-black/20 hover:bg-black/5 dark:hover:bg-white/5  flex items-center justify-between"
              aria-expanded={openFaq === i}
            >
              <span className="font-medium">{f.q}</span>
              <ChevronDown
                className={`size-5 transition-transform ${
                  openFaq === i ? "rotate-180" : ""
                }`}
              />
              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="basis-full col-span-2 w-full"
                  >
                    <p className="px-1 pt-3 pb-2 text-sm text-black/70 dark:text-white/70">
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <motion.article whileHover={{ scale: 1.02 }}>
        {" "}
        <CTA />
      </motion.article>
    </>
  );
}

const FAQS = [
  {
    q: "Đặt lịch xong có thể đổi giờ không?",
    a: "Có. Bạn có thể đổi giờ trước 2 giờ so với lịch đã đặt, tùy mức độ bận rộn của cửa hàng trong ngày.",
  },
  {
    q: "Có nhận các bé lần đầu đi spa không?",
    a: "Hoàn toàn có. Nhân viên sẽ quan sát phản ứng của bé, làm quen nhẹ nhàng và dùng sản phẩm dịu nhẹ.",
  },
  {
    q: "Có hỗ trợ đón – trả thú cưng không?",
    a: "Trong vòng bán kính 2km sẽ miễn phí, một số khu vực nội thành có hỗ trợ với phụ phí nhỏ. Liên hệ hotline để biết chi tiết.",
  },
  {
    q: "Thanh toán như thế nào?",
    a: "Bạn có thể thanh toán tại quầy (tiền mặt/QR) hoặc thanh toán online sau khi đặt lịch.",
  },
];

const FALLBACK_SERVICE_INTROS = [
  {
    title: "Tắm & vệ sinh cho chó mèo",
    badge: "BATH",
    icon: <Bath className="size-4" />,
    desc: "Làm sạch sâu, khử mùi và dưỡng lông để bé luôn thơm tho, dễ chịu.",
    highlights: [
      "Tắm bằng sản phẩm dịu nhẹ theo loại da",
      "Sấy tạo form lông gọn gàng, chu đáo",
      "Vệ sinh tai, móng và vùng nhạy cảm",
    ],
  },
  {
    title: "Cắt tỉa & chăm sóc lông",
    badge: "GROOMING",
    icon: <Scissors className="size-4" />,
    desc: "Tạo kiểu theo giống hoặc theo yêu cầu để bé gọn gàng và thoải mái vận động.",
    highlights: [
      "Tỉa mặt, chân, bụng theo tỷ lệ phù hợp",
      "Gỡ rối và xử lý cẩn thận lông vón cục",
      "Tư vấn lịch chăm sóc và khám định kỳ",
    ],
  },
  {
    title: "Khách sạn thú cưng",
    badge: "HOTEL",
    icon: <Star className="size-4" />,
    desc: "Lưu trú an toàn, theo dõi trạng thái bé hằng ngày khi bạn bận đi công tác.",
    highlights: [
      "Khu ở sạch, thoáng và tách khu phù hợp",
      "Cập nhật ăn uống, vận động mỗi ngày",
      "Hỗ trợ chăm sóc theo thói quen của bé",
    ],
  },
  {
    title: "Dịch vụ bổ sung",
    badge: "OTHER",
    icon: <Sparkles className="size-4" />,
    desc: "Các gói chăm sóc chuyên sâu cho từng nhu cầu riêng của thú cưng.",
    highlights: [
      "Khử mùi, dưỡng da lông chuyên biệt",
      "Xử lý ve rận và phòng ngừa tái phát",
      "Combo chăm sóc tiết kiệm theo tháng",
    ],
  },
];
