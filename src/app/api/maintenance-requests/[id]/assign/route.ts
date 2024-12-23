// src\app\api\maintenance-requests\[id]\assign\route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { RequestStatus } from "@prisma/client";
import { createNotification } from "@/lib/notification";
import { sendRealMail } from "@/lib/email";
import { verifyToken } from "@/utils/verifyToken";
import { sendSms } from "@/lib/sms";

/**
 *  @method PUT
 *  @route  ~/api/maintenance-requests/:id/assign
 *  @desc   Assign a technician to a maintenance request
 *  @access private (technician)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const technician = verifyToken(request);
    if (!technician) {
      return NextResponse.json(
        { message: "قم بتسجيل الدخول أولاً" },
        { status: 403 }
      );
    }

    if (technician.role !== "TECHNICAL") {
      return NextResponse.json({ message: "خاص بالتقني" }, { status: 403 });
    }
    const user = await prisma.user.findUnique({
      where:{id:technician.id}
    })

    if(!user?.isActive){
      return NextResponse.json({ message: "ليس لديك الصلاحية بعد لاستلام مهام صيانة" }, { status: 403 })
    }

    const requestId = parseInt(params.id);

    const maintenance = await prisma.maintenanceRequest.findUnique({
      where: { id: requestId },
      include: {
        technician: {
          select: {
            user: {
              select: {
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!maintenance) {
      return NextResponse.json(
        { message: "هذا الطلب غير متاح" },
        { status: 404 }
      );
    }

    if (maintenance.status === "ASSIGNED") {
      return NextResponse.json(
        { message: "هذا الطلب تم استلامه بالفعل" },
        { status: 400 }
      );
    }

    const maintenanceRequest = await prisma.maintenanceRequest.update({
      where: {
        id: requestId,
        status: "PENDING",
      },
      data: {
        technicianId: technician.id,
        status: RequestStatus.ASSIGNED,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            governorate: true,
            email: true,
          },
        },
      },
    });

    const maintenanceData = {
      RequestID: maintenanceRequest.id,
      deviceType: maintenanceRequest.deviceType,
      deviceModel: maintenanceRequest.deviceModel,
      problemDescription: maintenanceRequest.problemDescription,
      cost: maintenanceRequest.cost,
      isPaid: maintenanceRequest.isPaid,
      isPaidCheckFee: maintenanceRequest.isPaidCheckFee,
      status: maintenanceRequest.status,
      costumerID: maintenanceRequest.user.id,
      costumerName: maintenanceRequest.user.fullName,
      costumerGovernorate: maintenanceRequest.user.governorate,
    };

    const notificationNewOrderData = {
      title: "طلب صيانة جديد",
      deviceType: `نوع الجهاز: ${maintenanceRequest.deviceType}`,
      deviceModel: `موديل الجهاز: ${maintenanceRequest.deviceModel}`,
      governorate: `المحافظة: ${maintenanceRequest.governorate}`,
      price: `عزيزي السيد ${maintenanceRequest.user?.fullName}  لكي يتم إرسال التقني إليك  يجب دفع أجور كشف للصيانة بقيمة 10.000 ل.س على الرقم التالي 0999911111 في حالة syriatel والرقم 0955554444 في حالة MTN، هل أنت موافق؟`,
    };

    const contentEmail = `سيتم إرسال الفريق التقني الى العنوان التالي: "${maintenanceRequest.address}" بعد دفع أجور الكشف <br/> تكلفة أجور الكشف هي 10.000 ل.س <br/> يتم الدفع عبر أحد المنصات التالية: <br/> MTN Cach: على الرقم التالي "0960950112" <br/> SYRIATEL Cach: على الرقم التالي "0930361210" <br/> إن كنت موافق سارع بالدفع ليتم إرسال التقني إليك`;
    const seconderyContent =
      "بعد القيام بعملية الفحص سيتم إرسال التكلفة المقدرة للصيانة";
    // Create notification for the user
    await createNotification({
      recipientId: maintenanceRequest.customerId,
      senderId: technician.id,
      title: "دفع أجور الكشف",
      content: `تم تعيين تقني لطلب الصيانة  - "${maintenanceData.deviceType}" ${notificationNewOrderData.price}`,
      requestId: maintenanceData.RequestID,
    });

    await sendRealMail(
      {
        recipientName: maintenanceRequest.user.fullName,
        mainContent: `لقد تم تعيين تقني لطلب الصيانة "${maintenanceData.deviceType}"`,
        additionalContent: contentEmail,
        seconderyContent: seconderyContent,
      },
      {
        to: maintenanceRequest.user.email,
        subject: " دفع أجور الكشف",
        requestId: maintenanceData.RequestID,
      }
    );

    try {
      await sendSms(`   ترحب بكم EvoFix سيد/ة ${maintenanceRequest.user.fullName}
          تم استلام طلبك بنجاح
          ${notificationNewOrderData.price}
          `);
    } catch (error) {
      console.log(error);

      return NextResponse.json(
        {
          message:
            "خطأ بالوصول إلى خادم إرسال الرسائل ولكن تم تعيين التقني بنجاح ",
          request: maintenanceData,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: "تم تعيين التقني بنجاح",
        request: maintenanceData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error assigning technician", error);
    return NextResponse.json({ message: "خطأ من الخادم " }, { status: 500 });
  }
}
