type Long = protobuf.Long;
// DO NOT EDIT! This is a generated file. Edit the JSDoc in src/*.js instead and run 'npm run types'.

/** Namespace c2s. */
declare namespace c2s {

    /** MessageCmd enum. */
    enum MessageCmd {
        NULL = 0,
        JOIN_ROOM = 1,
        FRAME = 2,
        FRAMES = 3,
        LEAVE_ROOM = 4,
        HEARTBEAT = 5,
        START_GAME = 6
    }

    /** ErrorCode enum. */
    enum ErrorCode {
        OK = 0
    }

    /** Properties of a Result. */
    interface IResult {

        /** Result code */
        code?: (number|null);

        /** Result msg */
        msg?: (string|null);
    }

    /** Represents a Result. */
    class Result implements IResult {

        /**
         * Constructs a new Result.
         * @param [properties] Properties to set
         */
        constructor(properties?: c2s.IResult);

        /** Result code. */
        public code: number;

        /** Result msg. */
        public msg: string;

        /**
         * Creates a new Result instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Result instance
         */
        public static create(properties?: c2s.IResult): c2s.Result;

        /**
         * Encodes the specified Result message. Does not implicitly {@link c2s.Result.verify|verify} messages.
         * @param message Result message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: c2s.IResult, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Encodes the specified Result message, length delimited. Does not implicitly {@link c2s.Result.verify|verify} messages.
         * @param message Result message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: c2s.IResult, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a Result message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Result
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): c2s.Result;

        /**
         * Decodes a Result message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Result
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): c2s.Result;

        /**
         * Verifies a Result message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);
    }

    /** Properties of a JoinRoomReq. */
    interface IJoinRoomReq {

        /** JoinRoomReq uid */
        uid?: (string|null);
    }

    /** Represents a JoinRoomReq. */
    class JoinRoomReq implements IJoinRoomReq {

        /**
         * Constructs a new JoinRoomReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: c2s.IJoinRoomReq);

        /** JoinRoomReq uid. */
        public uid: string;

        /**
         * Creates a new JoinRoomReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns JoinRoomReq instance
         */
        public static create(properties?: c2s.IJoinRoomReq): c2s.JoinRoomReq;

        /**
         * Encodes the specified JoinRoomReq message. Does not implicitly {@link c2s.JoinRoomReq.verify|verify} messages.
         * @param message JoinRoomReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: c2s.IJoinRoomReq, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Encodes the specified JoinRoomReq message, length delimited. Does not implicitly {@link c2s.JoinRoomReq.verify|verify} messages.
         * @param message JoinRoomReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: c2s.IJoinRoomReq, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a JoinRoomReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns JoinRoomReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): c2s.JoinRoomReq;

        /**
         * Decodes a JoinRoomReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns JoinRoomReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): c2s.JoinRoomReq;

        /**
         * Verifies a JoinRoomReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);
    }

    /** Properties of a JoinRoomResp. */
    interface IJoinRoomResp {

        /** JoinRoomResp result */
        result?: (c2s.IResult|null);

        /** JoinRoomResp uid */
        uid?: (string|null);

        /** JoinRoomResp index */
        index?: (number|null);

        /** JoinRoomResp seed */
        seed?: (number|null);

        /** JoinRoomResp frameIndex */
        frameIndex?: (number|null);

        /** JoinRoomResp frame */
        frame?: (c2s.IFrame[]|null);
    }

    /** Represents a JoinRoomResp. */
    class JoinRoomResp implements IJoinRoomResp {

        /**
         * Constructs a new JoinRoomResp.
         * @param [properties] Properties to set
         */
        constructor(properties?: c2s.IJoinRoomResp);

        /** JoinRoomResp result. */
        public result?: (c2s.IResult|null);

        /** JoinRoomResp uid. */
        public uid: string;

        /** JoinRoomResp index. */
        public index: number;

        /** JoinRoomResp seed. */
        public seed: number;

        /** JoinRoomResp frameIndex. */
        public frameIndex: number;

        /** JoinRoomResp frame. */
        public frame: c2s.IFrame[];

        /**
         * Creates a new JoinRoomResp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns JoinRoomResp instance
         */
        public static create(properties?: c2s.IJoinRoomResp): c2s.JoinRoomResp;

        /**
         * Encodes the specified JoinRoomResp message. Does not implicitly {@link c2s.JoinRoomResp.verify|verify} messages.
         * @param message JoinRoomResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: c2s.IJoinRoomResp, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Encodes the specified JoinRoomResp message, length delimited. Does not implicitly {@link c2s.JoinRoomResp.verify|verify} messages.
         * @param message JoinRoomResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: c2s.IJoinRoomResp, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a JoinRoomResp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns JoinRoomResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): c2s.JoinRoomResp;

        /**
         * Decodes a JoinRoomResp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns JoinRoomResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): c2s.JoinRoomResp;

        /**
         * Verifies a JoinRoomResp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);
    }

    /** Properties of a Cmd. */
    interface ICmd {

        /** Cmd cmd */
        cmd?: (number|null);

        /** Cmd opt */
        opt?: (number|null);

        /** Cmd data */
        data?: (string|null);
    }

    /** Represents a Cmd. */
    class Cmd implements ICmd {

        /**
         * Constructs a new Cmd.
         * @param [properties] Properties to set
         */
        constructor(properties?: c2s.ICmd);

        /** Cmd cmd. */
        public cmd: number;

        /** Cmd opt. */
        public opt: number;

        /** Cmd data. */
        public data: string;

        /**
         * Creates a new Cmd instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Cmd instance
         */
        public static create(properties?: c2s.ICmd): c2s.Cmd;

        /**
         * Encodes the specified Cmd message. Does not implicitly {@link c2s.Cmd.verify|verify} messages.
         * @param message Cmd message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: c2s.ICmd, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Encodes the specified Cmd message, length delimited. Does not implicitly {@link c2s.Cmd.verify|verify} messages.
         * @param message Cmd message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: c2s.ICmd, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a Cmd message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Cmd
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): c2s.Cmd;

        /**
         * Decodes a Cmd message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Cmd
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): c2s.Cmd;

        /**
         * Verifies a Cmd message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);
    }

    /** Properties of a Frame. */
    interface IFrame {

        /** Frame frameIndex */
        frameIndex?: (number|null);

        /** Frame uid */
        uid?: (string|null);

        /** Frame index */
        index?: (number|null);

        /** Frame cmds */
        cmds?: (c2s.ICmd[]|null);
    }

    /** Represents a Frame. */
    class Frame implements IFrame {

        /**
         * Constructs a new Frame.
         * @param [properties] Properties to set
         */
        constructor(properties?: c2s.IFrame);

        /** Frame frameIndex. */
        public frameIndex: number;

        /** Frame uid. */
        public uid: string;

        /** Frame index. */
        public index: number;

        /** Frame cmds. */
        public cmds: c2s.ICmd[];

        /**
         * Creates a new Frame instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Frame instance
         */
        public static create(properties?: c2s.IFrame): c2s.Frame;

        /**
         * Encodes the specified Frame message. Does not implicitly {@link c2s.Frame.verify|verify} messages.
         * @param message Frame message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: c2s.IFrame, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Encodes the specified Frame message, length delimited. Does not implicitly {@link c2s.Frame.verify|verify} messages.
         * @param message Frame message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: c2s.IFrame, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a Frame message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Frame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): c2s.Frame;

        /**
         * Decodes a Frame message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Frame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): c2s.Frame;

        /**
         * Verifies a Frame message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);
    }

    /** Properties of a FrameReq. */
    interface IFrameReq {

        /** FrameReq frame */
        frame?: (c2s.IFrame[]|null);
    }

    /** Represents a FrameReq. */
    class FrameReq implements IFrameReq {

        /**
         * Constructs a new FrameReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: c2s.IFrameReq);

        /** FrameReq frame. */
        public frame: c2s.IFrame[];

        /**
         * Creates a new FrameReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FrameReq instance
         */
        public static create(properties?: c2s.IFrameReq): c2s.FrameReq;

        /**
         * Encodes the specified FrameReq message. Does not implicitly {@link c2s.FrameReq.verify|verify} messages.
         * @param message FrameReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: c2s.IFrameReq, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Encodes the specified FrameReq message, length delimited. Does not implicitly {@link c2s.FrameReq.verify|verify} messages.
         * @param message FrameReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: c2s.IFrameReq, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a FrameReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FrameReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): c2s.FrameReq;

        /**
         * Decodes a FrameReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FrameReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): c2s.FrameReq;

        /**
         * Verifies a FrameReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);
    }

    /** Properties of a FrameResp. */
    interface IFrameResp {

        /** FrameResp result */
        result?: (c2s.IResult|null);

        /** FrameResp uid */
        uid?: (string|null);

        /** FrameResp frameIndex */
        frameIndex?: (number|null);
    }

    /** Represents a FrameResp. */
    class FrameResp implements IFrameResp {

        /**
         * Constructs a new FrameResp.
         * @param [properties] Properties to set
         */
        constructor(properties?: c2s.IFrameResp);

        /** FrameResp result. */
        public result?: (c2s.IResult|null);

        /** FrameResp uid. */
        public uid: string;

        /** FrameResp frameIndex. */
        public frameIndex: number;

        /**
         * Creates a new FrameResp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FrameResp instance
         */
        public static create(properties?: c2s.IFrameResp): c2s.FrameResp;

        /**
         * Encodes the specified FrameResp message. Does not implicitly {@link c2s.FrameResp.verify|verify} messages.
         * @param message FrameResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: c2s.IFrameResp, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Encodes the specified FrameResp message, length delimited. Does not implicitly {@link c2s.FrameResp.verify|verify} messages.
         * @param message FrameResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: c2s.IFrameResp, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a FrameResp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FrameResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): c2s.FrameResp;

        /**
         * Decodes a FrameResp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FrameResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): c2s.FrameResp;

        /**
         * Verifies a FrameResp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);
    }

    /** Properties of a FramesNotify. */
    interface IFramesNotify {

        /** FramesNotify frame */
        frame?: (c2s.IFrame[]|null);
    }

    /** Represents a FramesNotify. */
    class FramesNotify implements IFramesNotify {

        /**
         * Constructs a new FramesNotify.
         * @param [properties] Properties to set
         */
        constructor(properties?: c2s.IFramesNotify);

        /** FramesNotify frame. */
        public frame: c2s.IFrame[];

        /**
         * Creates a new FramesNotify instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FramesNotify instance
         */
        public static create(properties?: c2s.IFramesNotify): c2s.FramesNotify;

        /**
         * Encodes the specified FramesNotify message. Does not implicitly {@link c2s.FramesNotify.verify|verify} messages.
         * @param message FramesNotify message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: c2s.IFramesNotify, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Encodes the specified FramesNotify message, length delimited. Does not implicitly {@link c2s.FramesNotify.verify|verify} messages.
         * @param message FramesNotify message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: c2s.IFramesNotify, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a FramesNotify message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FramesNotify
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): c2s.FramesNotify;

        /**
         * Decodes a FramesNotify message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FramesNotify
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): c2s.FramesNotify;

        /**
         * Verifies a FramesNotify message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);
    }
}

/** Namespace cs. */
declare namespace cs {

    /** MessageType enum. */
    enum MessageType {
        None = 0,
        Request = 1,
        Response = 2,
        Notify = 3,
        Broadcast = 4
    }

    /** Properties of a Message. */
    interface IMessage {

        /** Message ID */
        ID?: (number|null);

        /** Message UID */
        UID?: (number|Long|null);

        /** Message msgID */
        msgID?: (number|null);

        /** Message msgType */
        msgType?: (number|null);

        /** Message seq */
        seq?: (number|null);

        /** Message options */
        options?: ({ [k: string]: Uint8Array }|null);

        /** Message body */
        body?: (google.protobuf.IAny|null);
    }

    /** Represents a Message. */
    class Message implements IMessage {

        /**
         * Constructs a new Message.
         * @param [properties] Properties to set
         */
        constructor(properties?: cs.IMessage);

        /** Message ID. */
        public ID: number;

        /** Message UID. */
        public UID: (number|Long);

        /** Message msgID. */
        public msgID: number;

        /** Message msgType. */
        public msgType: number;

        /** Message seq. */
        public seq: number;

        /** Message options. */
        public options: { [k: string]: Uint8Array };

        /** Message body. */
        public body?: (google.protobuf.IAny|null);

        /**
         * Creates a new Message instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message instance
         */
        public static create(properties?: cs.IMessage): cs.Message;

        /**
         * Encodes the specified Message message. Does not implicitly {@link cs.Message.verify|verify} messages.
         * @param message Message message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cs.IMessage, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Encodes the specified Message message, length delimited. Does not implicitly {@link cs.Message.verify|verify} messages.
         * @param message Message message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cs.IMessage, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a Message message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Message
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): cs.Message;

        /**
         * Decodes a Message message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Message
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): cs.Message;

        /**
         * Verifies a Message message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);
    }
}

/** Namespace google. */
declare namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of an Any. */
        interface IAny {

            /** Any type_url */
            type_url?: (string|null);

            /** Any value */
            value?: (Uint8Array|null);
        }

        /** Represents an Any. */
        class Any implements IAny {

            /**
             * Constructs a new Any.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IAny);

            /** Any type_url. */
            public type_url: string;

            /** Any value. */
            public value: Uint8Array;

            /**
             * Creates a new Any instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Any instance
             */
            public static create(properties?: google.protobuf.IAny): google.protobuf.Any;

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IAny, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IAny, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): google.protobuf.Any;

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): google.protobuf.Any;

            /**
             * Verifies an Any message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);
        }
    }
}
