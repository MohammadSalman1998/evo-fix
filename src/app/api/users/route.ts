// src\app\api\users\route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import bcrypt from "bcryptjs";
import { RegisterUserDto } from "@/utils/dtos";
import { RegisterUserSchema } from "@/utils/validationSchemas";
import { Role } from "@prisma/client";
import { generateJWT } from "@/utils/generateToken";
// import { createNotification } from "@/lib/notification";
import { sendRealMail } from "@/lib/email";
// import { sendSms } from "@/lib/sms";
import jwt from "jsonwebtoken";
import { HOME_EVOFIX } from "@/utils/constants";

/**
 *  @method GET
 *  @route  ~/api/users
 *  @desc   Get all users
 *  @access private (only admin can show all users  Or [subAdmin By same governorate])
 */
export async function GET(request: NextRequest) {
  try {
    const adminToken = verifyToken(request);

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: adminToken?.id,
        },
        role: "USER",
      },
      include: {
        customer: true,
        technician: true,
        subadmin: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const subAdmin = await prisma.user.findUnique({
      where: {
        id: adminToken?.id,
      },
      select: {
        subadmin: {
          select: {
            governorate: true,
          },
        },
      },
    });

    const usersByGovernorate = await prisma.user.findMany({
      where: {
        governorate: subAdmin?.subadmin?.governorate || "",
        id: {
          not: adminToken?.id,
        },
        role: "USER",
      },
      include: {
        customer: true,
        technician: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const countUsers = users.length;
    const countUsersByGovernorate = usersByGovernorate.length;

    if (adminToken?.role === "ADMIN" && countUsers < 1) {
      return NextResponse.json(
        { message: "لا يوجد حسابات متاحة" },
        { status: 200 }
      );
    } else if (adminToken?.role === "SUBADMIN" && countUsersByGovernorate < 1) {
      return NextResponse.json(
        { message: "لا يوجد حسابات متاحة" },
        { status: 200 }
      );
    }

    const usersByGovernorateResponse = usersByGovernorate.map(
      (userByGovernorate) => ({
        id: userByGovernorate.id,
        fullName: userByGovernorate.fullName,
        email: userByGovernorate.email,
        governorate: userByGovernorate.governorate,
        phoneNO: userByGovernorate.phoneNO,
        address: userByGovernorate.address,
        role: userByGovernorate.role,
        isActive: userByGovernorate.isActive,
        isVerified: userByGovernorate.isVerified,
        technician_specialization: userByGovernorate.technician?.specialization,
        technician_services: userByGovernorate.technician?.services,
      })
    );

    const usersResponse = users.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      governorate: user.governorate,
      phoneNO: user.phoneNO,
      address: user.address,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
      technician_specialization: user.technician?.specialization,
      technician_services: user.technician?.services,
      admin_department: user.subadmin?.department,
      admin_governorate: user.subadmin?.governorate,
    }));

    if (adminToken !== null && adminToken.role === "ADMIN") {
      return NextResponse.json(usersResponse, { status: 200 });
    } else if (adminToken !== null && adminToken.role === "SUBADMIN") {
      return NextResponse.json(usersByGovernorateResponse, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "ليس لديك الصلاحية" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Error fetching users", error);
    return NextResponse.json(
      { message: "خطأ في جلب البيانات " },
      { status: 500 }
    );
  }
}

/**
 *  @method POST
 *  @route  ~/api/users
 *  @desc   Create a new user
 *  @access public
 */
export async function POST(request: NextRequest) {
  try {
    const admin = verifyToken(request);
    const body = (await request.json()) as RegisterUserDto;
    const validation = RegisterUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (user) {
      return NextResponse.json(
        { message: "هذا الحساب موجود مسبقا" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        governorate: body.governorate,
        fullName: body.fullName,
        password: hashedPassword,
        phoneNO: body.phoneNO,
        address: body.address,
        avatar: body.avatar,
        isActive: false,
        // body.role === Role.TECHNICAL ||
        // body.role === Role.ADMIN ||
        // body.role === Role.SUBADMIN
        //   ? false
        //   : true,
        role:
          admin?.role === Role.ADMIN
            ? (body.role as Role) || Role.USER
            : body.role === Role.TECHNICAL
            ? (body.role as Role)
            : Role.USER,
        customer:
          body.role !== Role.SUBADMIN &&
          body.role !== Role.ADMIN &&
          body.role !== Role.TECHNICAL
            ? { create: {} }
            : undefined,
        technician:
          body.role === Role.TECHNICAL
            ? {
                create: {
                  specialization: body.specialization,
                  services: body.services,
                },
              }
            : undefined,
        subadmin:
          body.role === Role.SUBADMIN
            ? {
                create: {
                  department: `مدير محافظة ${
                    body.governorateAdmin || body.governorate
                  } بقسم الصيانة`,
                  governorate: body.governorateAdmin || body.governorate,
                },
              }
            : undefined,
      },
      include: {
        customer: true,
        technician: true,
        subadmin: true,
      },
    });

    const userResponse = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      phoneNO: newUser.phoneNO,
      governorate: newUser.governorate,
      role: newUser.role,
      isVerified: newUser.isVerified,
      // customerId: newUser.customer?.id,
      technician_specialization: newUser.technician?.specialization,
      technician_services: newUser.technician?.services,
      admin_department: newUser.subadmin?.department,
      admin_governorate: newUser.subadmin?.governorate,
    };

    // إنشاء رمز التحقق
    const secret = process.env.JWT_SECRET + newUser.password;
    const token = jwt.sign({ id: newUser.id }, secret, { expiresIn: "15m" });

    // رابط التحقق
    const verificationLink = `${HOME_EVOFIX}/verify-email?token=${token}&id=${newUser.id}`;

    // إرسال البريد الإلكتروني
    await sendRealMail(
      {
        recipientName: newUser.fullName,
        mainContent: "تحقق من بريدك الإلكتروني",
        additionalContent: `انقر <a href="${verificationLink}">هنا</a> للتحقق من بريدك الإلكتروني.`,
      },
      {
        to: newUser.email,
        subject: "تحقق من بريدك الإلكتروني",
      }
    );

    const tokenPayload = {
      id: newUser.id,
      role: newUser.role,
      fullName: newUser.fullName,
    };

    const registerToken = generateJWT(tokenPayload);

    return NextResponse.json(
      {
        message: "تم إرسال رمز التحقق إلى بريدك الإلكتروني",
        ...userResponse,
        token: registerToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating user", error);
    return NextResponse.json({ message: "خطأ من الخادم" }, { status: 500 });
  }
}
