import Joi from "joi";
import Bookings from "../models/Bookings";
import { slotTiming } from "../utils/constants";
import { sendMail } from "../utils/sendgrid";
type IReservationPayload = {
    tableNumber: number;
    slots: number[];
    date: string;
    userId: string;
    username: string;
    bookingTime: Date;
    updatedAt: Date;
    status: "BOOKED" | "CANCELLED" | "COMPLETED" | "REJECTED" | "EXPIRED";
};

export const reservation = async (_req: any, _res: any) => {
    let payload: IReservationPayload;
    const schema = Joi.object({
        tableNumber: Joi.number().required(),
        slots: Joi.array().required(),
        date: Joi.string().required(),
    });
    const schemaObj = schema.validate(_req.body);
    if (schemaObj.error) {
        return _res.status(400).json({
            message: schemaObj.error.message || "Bad Request",
        });
    } else {
        payload = schemaObj.value;
    }
    payload = {
        ...payload,
        userId: _req.tokenData.userId,
        username: _req.tokenData.username || _req.tokenData.email,
        bookingTime: new Date(),
        updatedAt: new Date(),
        status: "BOOKED",
    };
    try {
        const result = await Bookings.create(payload);
        const emailPayload = {
            to: _req.tokenData.email,
        };
        await sendMail(emailPayload);
        return _res.status(201).json({
            status: 201,
            bookingId: result._id,
            message: "Success",
        });
    } catch (error) {
        console.error("console error: ", error);
        return _res.status(500).send({
            message: error.message || "Internal Server Error!",
            code: 500,
        });
    }
};

type IavailableSlotsQuery = {
    tableNumber: number;
    date: Date;
};
export const getAvailableSlots = async (_req: any, _res: any) => {
    let query: IavailableSlotsQuery;
    const schema = Joi.object({
        tableNumber: Joi.number().required(),
        date: Joi.string().required(),
    });
    const schemaObj = schema.validate(_req.query);
    if (schemaObj.error) {
        return _res.status(400).json({
            message: schemaObj.error.message || "Bad Request",
        });
    } else {
        query = schemaObj.value;
    }
    try {
        const result = await Bookings.find(query).select("slots");
        const totalSlots: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        let availableSlots: number[] = [];
        let bookedSlots: number[] = [];
        if (result && result.length) {
            bookedSlots = result.reduce((a: any, n: any) => {
                return [...a, ...n.slots];
            }, []);
            availableSlots = totalSlots.filter((item: number) => !bookedSlots.includes(item));
        } else {
            availableSlots = totalSlots;
        }
        let slots: any = totalSlots.map((item: number) => {
            return {
                slotNumber: item,
                slot: slotTiming[item],
                status: bookedSlots.includes(item) ? "BOOKED" : "AVAILABLE",
            };
        });
        return _res.status(200).json({
            status: 200,
            availableSlots,
            bookedSlots,
            slots,
            message: availableSlots.length ? "Success" : "No Slots Available!",
        });
    } catch (error) {
        console.error("console error: ", error);
        return _res.status(500).send({
            message: error.message || "Internal Server Error!",
            code: 500,
        });
    }
};
