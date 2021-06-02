 (function(global){global.$protobuf = global.protobuf;
$protobuf.roots.default=global;})(typeof window !== "undefined" && window|| typeof global !== "undefined" && global|| typeof self   !== "undefined" && self|| this)
// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.c2s = (function() {

    /**
     * Namespace c2s.
     * @exports c2s
     * @namespace
     */
    var c2s = {};

    /**
     * MessageCmd enum.
     * @name c2s.MessageCmd
     * @enum {string}
     * @property {number} NULL=0 NULL value
     * @property {number} JOIN_ROOM=1 JOIN_ROOM value
     * @property {number} FRAME=2 FRAME value
     * @property {number} FRAMES=3 FRAMES value
     * @property {number} LEAVE_ROOM=4 LEAVE_ROOM value
     * @property {number} HEARTBEAT=5 HEARTBEAT value
     * @property {number} START_GAME=6 START_GAME value
     */
    c2s.MessageCmd = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "NULL"] = 0;
        values[valuesById[1] = "JOIN_ROOM"] = 1;
        values[valuesById[2] = "FRAME"] = 2;
        values[valuesById[3] = "FRAMES"] = 3;
        values[valuesById[4] = "LEAVE_ROOM"] = 4;
        values[valuesById[5] = "HEARTBEAT"] = 5;
        values[valuesById[6] = "START_GAME"] = 6;
        return values;
    })();

    /**
     * ErrorCode enum.
     * @name c2s.ErrorCode
     * @enum {string}
     * @property {number} OK=0 OK value
     */
    c2s.ErrorCode = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "OK"] = 0;
        return values;
    })();

    c2s.Result = (function() {

        /**
         * Properties of a Result.
         * @memberof c2s
         * @interface IResult
         * @property {number|null} [code] Result code
         * @property {string|null} [msg] Result msg
         */

        /**
         * Constructs a new Result.
         * @memberof c2s
         * @classdesc Represents a Result.
         * @implements IResult
         * @constructor
         * @param {c2s.IResult=} [properties] Properties to set
         */
        function Result(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Result code.
         * @member {number} code
         * @memberof c2s.Result
         * @instance
         */
        Result.prototype.code = 0;

        /**
         * Result msg.
         * @member {string} msg
         * @memberof c2s.Result
         * @instance
         */
        Result.prototype.msg = "";

        /**
         * Creates a new Result instance using the specified properties.
         * @function create
         * @memberof c2s.Result
         * @static
         * @param {c2s.IResult=} [properties] Properties to set
         * @returns {c2s.Result} Result instance
         */
        Result.create = function create(properties) {
            return new Result(properties);
        };

        /**
         * Encodes the specified Result message. Does not implicitly {@link c2s.Result.verify|verify} messages.
         * @function encode
         * @memberof c2s.Result
         * @static
         * @param {c2s.IResult} message Result message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Result.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && message.hasOwnProperty("code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.msg != null && message.hasOwnProperty("msg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
            return writer;
        };

        /**
         * Encodes the specified Result message, length delimited. Does not implicitly {@link c2s.Result.verify|verify} messages.
         * @function encodeDelimited
         * @memberof c2s.Result
         * @static
         * @param {c2s.IResult} message Result message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Result.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Result message from the specified reader or buffer.
         * @function decode
         * @memberof c2s.Result
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {c2s.Result} Result
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Result.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.c2s.Result();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.code = reader.int32();
                    break;
                case 2:
                    message.msg = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Result message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof c2s.Result
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {c2s.Result} Result
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Result.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Result message.
         * @function verify
         * @memberof c2s.Result
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Result.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            return null;
        };

        return Result;
    })();

    c2s.JoinRoomReq = (function() {

        /**
         * Properties of a JoinRoomReq.
         * @memberof c2s
         * @interface IJoinRoomReq
         * @property {string|null} [uid] JoinRoomReq uid
         */

        /**
         * Constructs a new JoinRoomReq.
         * @memberof c2s
         * @classdesc Represents a JoinRoomReq.
         * @implements IJoinRoomReq
         * @constructor
         * @param {c2s.IJoinRoomReq=} [properties] Properties to set
         */
        function JoinRoomReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * JoinRoomReq uid.
         * @member {string} uid
         * @memberof c2s.JoinRoomReq
         * @instance
         */
        JoinRoomReq.prototype.uid = "";

        /**
         * Creates a new JoinRoomReq instance using the specified properties.
         * @function create
         * @memberof c2s.JoinRoomReq
         * @static
         * @param {c2s.IJoinRoomReq=} [properties] Properties to set
         * @returns {c2s.JoinRoomReq} JoinRoomReq instance
         */
        JoinRoomReq.create = function create(properties) {
            return new JoinRoomReq(properties);
        };

        /**
         * Encodes the specified JoinRoomReq message. Does not implicitly {@link c2s.JoinRoomReq.verify|verify} messages.
         * @function encode
         * @memberof c2s.JoinRoomReq
         * @static
         * @param {c2s.IJoinRoomReq} message JoinRoomReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JoinRoomReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.uid != null && message.hasOwnProperty("uid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.uid);
            return writer;
        };

        /**
         * Encodes the specified JoinRoomReq message, length delimited. Does not implicitly {@link c2s.JoinRoomReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof c2s.JoinRoomReq
         * @static
         * @param {c2s.IJoinRoomReq} message JoinRoomReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JoinRoomReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a JoinRoomReq message from the specified reader or buffer.
         * @function decode
         * @memberof c2s.JoinRoomReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {c2s.JoinRoomReq} JoinRoomReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JoinRoomReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.c2s.JoinRoomReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.uid = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a JoinRoomReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof c2s.JoinRoomReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {c2s.JoinRoomReq} JoinRoomReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JoinRoomReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a JoinRoomReq message.
         * @function verify
         * @memberof c2s.JoinRoomReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        JoinRoomReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.uid != null && message.hasOwnProperty("uid"))
                if (!$util.isString(message.uid))
                    return "uid: string expected";
            return null;
        };

        return JoinRoomReq;
    })();

    c2s.JoinRoomResp = (function() {

        /**
         * Properties of a JoinRoomResp.
         * @memberof c2s
         * @interface IJoinRoomResp
         * @property {c2s.IResult|null} [result] JoinRoomResp result
         * @property {string|null} [uid] JoinRoomResp uid
         * @property {number|null} [index] JoinRoomResp index
         * @property {number|null} [seed] JoinRoomResp seed
         * @property {number|null} [frameIndex] JoinRoomResp frameIndex
         * @property {Array.<c2s.IFrame>|null} [frame] JoinRoomResp frame
         */

        /**
         * Constructs a new JoinRoomResp.
         * @memberof c2s
         * @classdesc Represents a JoinRoomResp.
         * @implements IJoinRoomResp
         * @constructor
         * @param {c2s.IJoinRoomResp=} [properties] Properties to set
         */
        function JoinRoomResp(properties) {
            this.frame = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * JoinRoomResp result.
         * @member {c2s.IResult|null|undefined} result
         * @memberof c2s.JoinRoomResp
         * @instance
         */
        JoinRoomResp.prototype.result = null;

        /**
         * JoinRoomResp uid.
         * @member {string} uid
         * @memberof c2s.JoinRoomResp
         * @instance
         */
        JoinRoomResp.prototype.uid = "";

        /**
         * JoinRoomResp index.
         * @member {number} index
         * @memberof c2s.JoinRoomResp
         * @instance
         */
        JoinRoomResp.prototype.index = 0;

        /**
         * JoinRoomResp seed.
         * @member {number} seed
         * @memberof c2s.JoinRoomResp
         * @instance
         */
        JoinRoomResp.prototype.seed = 0;

        /**
         * JoinRoomResp frameIndex.
         * @member {number} frameIndex
         * @memberof c2s.JoinRoomResp
         * @instance
         */
        JoinRoomResp.prototype.frameIndex = 0;

        /**
         * JoinRoomResp frame.
         * @member {Array.<c2s.IFrame>} frame
         * @memberof c2s.JoinRoomResp
         * @instance
         */
        JoinRoomResp.prototype.frame = $util.emptyArray;

        /**
         * Creates a new JoinRoomResp instance using the specified properties.
         * @function create
         * @memberof c2s.JoinRoomResp
         * @static
         * @param {c2s.IJoinRoomResp=} [properties] Properties to set
         * @returns {c2s.JoinRoomResp} JoinRoomResp instance
         */
        JoinRoomResp.create = function create(properties) {
            return new JoinRoomResp(properties);
        };

        /**
         * Encodes the specified JoinRoomResp message. Does not implicitly {@link c2s.JoinRoomResp.verify|verify} messages.
         * @function encode
         * @memberof c2s.JoinRoomResp
         * @static
         * @param {c2s.IJoinRoomResp} message JoinRoomResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JoinRoomResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.result != null && message.hasOwnProperty("result"))
                $root.c2s.Result.encode(message.result, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.uid != null && message.hasOwnProperty("uid"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.uid);
            if (message.index != null && message.hasOwnProperty("index"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.index);
            if (message.seed != null && message.hasOwnProperty("seed"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.seed);
            if (message.frameIndex != null && message.hasOwnProperty("frameIndex"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.frameIndex);
            if (message.frame != null && message.frame.length)
                for (var i = 0; i < message.frame.length; ++i)
                    $root.c2s.Frame.encode(message.frame[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified JoinRoomResp message, length delimited. Does not implicitly {@link c2s.JoinRoomResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof c2s.JoinRoomResp
         * @static
         * @param {c2s.IJoinRoomResp} message JoinRoomResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JoinRoomResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a JoinRoomResp message from the specified reader or buffer.
         * @function decode
         * @memberof c2s.JoinRoomResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {c2s.JoinRoomResp} JoinRoomResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JoinRoomResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.c2s.JoinRoomResp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.result = $root.c2s.Result.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.uid = reader.string();
                    break;
                case 3:
                    message.index = reader.int32();
                    break;
                case 4:
                    message.seed = reader.int32();
                    break;
                case 5:
                    message.frameIndex = reader.int32();
                    break;
                case 6:
                    if (!(message.frame && message.frame.length))
                        message.frame = [];
                    message.frame.push($root.c2s.Frame.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a JoinRoomResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof c2s.JoinRoomResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {c2s.JoinRoomResp} JoinRoomResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JoinRoomResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a JoinRoomResp message.
         * @function verify
         * @memberof c2s.JoinRoomResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        JoinRoomResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.result != null && message.hasOwnProperty("result")) {
                var error = $root.c2s.Result.verify(message.result);
                if (error)
                    return "result." + error;
            }
            if (message.uid != null && message.hasOwnProperty("uid"))
                if (!$util.isString(message.uid))
                    return "uid: string expected";
            if (message.index != null && message.hasOwnProperty("index"))
                if (!$util.isInteger(message.index))
                    return "index: integer expected";
            if (message.seed != null && message.hasOwnProperty("seed"))
                if (!$util.isInteger(message.seed))
                    return "seed: integer expected";
            if (message.frameIndex != null && message.hasOwnProperty("frameIndex"))
                if (!$util.isInteger(message.frameIndex))
                    return "frameIndex: integer expected";
            if (message.frame != null && message.hasOwnProperty("frame")) {
                if (!Array.isArray(message.frame))
                    return "frame: array expected";
                for (var i = 0; i < message.frame.length; ++i) {
                    var error = $root.c2s.Frame.verify(message.frame[i]);
                    if (error)
                        return "frame." + error;
                }
            }
            return null;
        };

        return JoinRoomResp;
    })();

    c2s.Cmd = (function() {

        /**
         * Properties of a Cmd.
         * @memberof c2s
         * @interface ICmd
         * @property {number|null} [cmd] Cmd cmd
         * @property {number|null} [opt] Cmd opt
         * @property {string|null} [data] Cmd data
         */

        /**
         * Constructs a new Cmd.
         * @memberof c2s
         * @classdesc Represents a Cmd.
         * @implements ICmd
         * @constructor
         * @param {c2s.ICmd=} [properties] Properties to set
         */
        function Cmd(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Cmd cmd.
         * @member {number} cmd
         * @memberof c2s.Cmd
         * @instance
         */
        Cmd.prototype.cmd = 0;

        /**
         * Cmd opt.
         * @member {number} opt
         * @memberof c2s.Cmd
         * @instance
         */
        Cmd.prototype.opt = 0;

        /**
         * Cmd data.
         * @member {string} data
         * @memberof c2s.Cmd
         * @instance
         */
        Cmd.prototype.data = "";

        /**
         * Creates a new Cmd instance using the specified properties.
         * @function create
         * @memberof c2s.Cmd
         * @static
         * @param {c2s.ICmd=} [properties] Properties to set
         * @returns {c2s.Cmd} Cmd instance
         */
        Cmd.create = function create(properties) {
            return new Cmd(properties);
        };

        /**
         * Encodes the specified Cmd message. Does not implicitly {@link c2s.Cmd.verify|verify} messages.
         * @function encode
         * @memberof c2s.Cmd
         * @static
         * @param {c2s.ICmd} message Cmd message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Cmd.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cmd != null && message.hasOwnProperty("cmd"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.cmd);
            if (message.opt != null && message.hasOwnProperty("opt"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.opt);
            if (message.data != null && message.hasOwnProperty("data"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.data);
            return writer;
        };

        /**
         * Encodes the specified Cmd message, length delimited. Does not implicitly {@link c2s.Cmd.verify|verify} messages.
         * @function encodeDelimited
         * @memberof c2s.Cmd
         * @static
         * @param {c2s.ICmd} message Cmd message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Cmd.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Cmd message from the specified reader or buffer.
         * @function decode
         * @memberof c2s.Cmd
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {c2s.Cmd} Cmd
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Cmd.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.c2s.Cmd();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cmd = reader.int32();
                    break;
                case 2:
                    message.opt = reader.int32();
                    break;
                case 3:
                    message.data = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Cmd message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof c2s.Cmd
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {c2s.Cmd} Cmd
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Cmd.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Cmd message.
         * @function verify
         * @memberof c2s.Cmd
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Cmd.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cmd != null && message.hasOwnProperty("cmd"))
                if (!$util.isInteger(message.cmd))
                    return "cmd: integer expected";
            if (message.opt != null && message.hasOwnProperty("opt"))
                if (!$util.isInteger(message.opt))
                    return "opt: integer expected";
            if (message.data != null && message.hasOwnProperty("data"))
                if (!$util.isString(message.data))
                    return "data: string expected";
            return null;
        };

        return Cmd;
    })();

    c2s.Frame = (function() {

        /**
         * Properties of a Frame.
         * @memberof c2s
         * @interface IFrame
         * @property {number|null} [frameIndex] Frame frameIndex
         * @property {string|null} [uid] Frame uid
         * @property {number|null} [index] Frame index
         * @property {Array.<c2s.ICmd>|null} [cmds] Frame cmds
         */

        /**
         * Constructs a new Frame.
         * @memberof c2s
         * @classdesc Represents a Frame.
         * @implements IFrame
         * @constructor
         * @param {c2s.IFrame=} [properties] Properties to set
         */
        function Frame(properties) {
            this.cmds = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Frame frameIndex.
         * @member {number} frameIndex
         * @memberof c2s.Frame
         * @instance
         */
        Frame.prototype.frameIndex = 0;

        /**
         * Frame uid.
         * @member {string} uid
         * @memberof c2s.Frame
         * @instance
         */
        Frame.prototype.uid = "";

        /**
         * Frame index.
         * @member {number} index
         * @memberof c2s.Frame
         * @instance
         */
        Frame.prototype.index = 0;

        /**
         * Frame cmds.
         * @member {Array.<c2s.ICmd>} cmds
         * @memberof c2s.Frame
         * @instance
         */
        Frame.prototype.cmds = $util.emptyArray;

        /**
         * Creates a new Frame instance using the specified properties.
         * @function create
         * @memberof c2s.Frame
         * @static
         * @param {c2s.IFrame=} [properties] Properties to set
         * @returns {c2s.Frame} Frame instance
         */
        Frame.create = function create(properties) {
            return new Frame(properties);
        };

        /**
         * Encodes the specified Frame message. Does not implicitly {@link c2s.Frame.verify|verify} messages.
         * @function encode
         * @memberof c2s.Frame
         * @static
         * @param {c2s.IFrame} message Frame message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Frame.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.frameIndex != null && message.hasOwnProperty("frameIndex"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.frameIndex);
            if (message.uid != null && message.hasOwnProperty("uid"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.uid);
            if (message.index != null && message.hasOwnProperty("index"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.index);
            if (message.cmds != null && message.cmds.length)
                for (var i = 0; i < message.cmds.length; ++i)
                    $root.c2s.Cmd.encode(message.cmds[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Frame message, length delimited. Does not implicitly {@link c2s.Frame.verify|verify} messages.
         * @function encodeDelimited
         * @memberof c2s.Frame
         * @static
         * @param {c2s.IFrame} message Frame message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Frame.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Frame message from the specified reader or buffer.
         * @function decode
         * @memberof c2s.Frame
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {c2s.Frame} Frame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Frame.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.c2s.Frame();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.frameIndex = reader.int32();
                    break;
                case 2:
                    message.uid = reader.string();
                    break;
                case 3:
                    message.index = reader.int32();
                    break;
                case 4:
                    if (!(message.cmds && message.cmds.length))
                        message.cmds = [];
                    message.cmds.push($root.c2s.Cmd.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Frame message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof c2s.Frame
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {c2s.Frame} Frame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Frame.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Frame message.
         * @function verify
         * @memberof c2s.Frame
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Frame.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.frameIndex != null && message.hasOwnProperty("frameIndex"))
                if (!$util.isInteger(message.frameIndex))
                    return "frameIndex: integer expected";
            if (message.uid != null && message.hasOwnProperty("uid"))
                if (!$util.isString(message.uid))
                    return "uid: string expected";
            if (message.index != null && message.hasOwnProperty("index"))
                if (!$util.isInteger(message.index))
                    return "index: integer expected";
            if (message.cmds != null && message.hasOwnProperty("cmds")) {
                if (!Array.isArray(message.cmds))
                    return "cmds: array expected";
                for (var i = 0; i < message.cmds.length; ++i) {
                    var error = $root.c2s.Cmd.verify(message.cmds[i]);
                    if (error)
                        return "cmds." + error;
                }
            }
            return null;
        };

        return Frame;
    })();

    c2s.FrameReq = (function() {

        /**
         * Properties of a FrameReq.
         * @memberof c2s
         * @interface IFrameReq
         * @property {Array.<c2s.IFrame>|null} [frame] FrameReq frame
         */

        /**
         * Constructs a new FrameReq.
         * @memberof c2s
         * @classdesc Represents a FrameReq.
         * @implements IFrameReq
         * @constructor
         * @param {c2s.IFrameReq=} [properties] Properties to set
         */
        function FrameReq(properties) {
            this.frame = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FrameReq frame.
         * @member {Array.<c2s.IFrame>} frame
         * @memberof c2s.FrameReq
         * @instance
         */
        FrameReq.prototype.frame = $util.emptyArray;

        /**
         * Creates a new FrameReq instance using the specified properties.
         * @function create
         * @memberof c2s.FrameReq
         * @static
         * @param {c2s.IFrameReq=} [properties] Properties to set
         * @returns {c2s.FrameReq} FrameReq instance
         */
        FrameReq.create = function create(properties) {
            return new FrameReq(properties);
        };

        /**
         * Encodes the specified FrameReq message. Does not implicitly {@link c2s.FrameReq.verify|verify} messages.
         * @function encode
         * @memberof c2s.FrameReq
         * @static
         * @param {c2s.IFrameReq} message FrameReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FrameReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.frame != null && message.frame.length)
                for (var i = 0; i < message.frame.length; ++i)
                    $root.c2s.Frame.encode(message.frame[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified FrameReq message, length delimited. Does not implicitly {@link c2s.FrameReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof c2s.FrameReq
         * @static
         * @param {c2s.IFrameReq} message FrameReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FrameReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FrameReq message from the specified reader or buffer.
         * @function decode
         * @memberof c2s.FrameReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {c2s.FrameReq} FrameReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FrameReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.c2s.FrameReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.frame && message.frame.length))
                        message.frame = [];
                    message.frame.push($root.c2s.Frame.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FrameReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof c2s.FrameReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {c2s.FrameReq} FrameReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FrameReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FrameReq message.
         * @function verify
         * @memberof c2s.FrameReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FrameReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.frame != null && message.hasOwnProperty("frame")) {
                if (!Array.isArray(message.frame))
                    return "frame: array expected";
                for (var i = 0; i < message.frame.length; ++i) {
                    var error = $root.c2s.Frame.verify(message.frame[i]);
                    if (error)
                        return "frame." + error;
                }
            }
            return null;
        };

        return FrameReq;
    })();

    c2s.FrameResp = (function() {

        /**
         * Properties of a FrameResp.
         * @memberof c2s
         * @interface IFrameResp
         * @property {c2s.IResult|null} [result] FrameResp result
         * @property {string|null} [uid] FrameResp uid
         * @property {number|null} [frameIndex] FrameResp frameIndex
         */

        /**
         * Constructs a new FrameResp.
         * @memberof c2s
         * @classdesc Represents a FrameResp.
         * @implements IFrameResp
         * @constructor
         * @param {c2s.IFrameResp=} [properties] Properties to set
         */
        function FrameResp(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FrameResp result.
         * @member {c2s.IResult|null|undefined} result
         * @memberof c2s.FrameResp
         * @instance
         */
        FrameResp.prototype.result = null;

        /**
         * FrameResp uid.
         * @member {string} uid
         * @memberof c2s.FrameResp
         * @instance
         */
        FrameResp.prototype.uid = "";

        /**
         * FrameResp frameIndex.
         * @member {number} frameIndex
         * @memberof c2s.FrameResp
         * @instance
         */
        FrameResp.prototype.frameIndex = 0;

        /**
         * Creates a new FrameResp instance using the specified properties.
         * @function create
         * @memberof c2s.FrameResp
         * @static
         * @param {c2s.IFrameResp=} [properties] Properties to set
         * @returns {c2s.FrameResp} FrameResp instance
         */
        FrameResp.create = function create(properties) {
            return new FrameResp(properties);
        };

        /**
         * Encodes the specified FrameResp message. Does not implicitly {@link c2s.FrameResp.verify|verify} messages.
         * @function encode
         * @memberof c2s.FrameResp
         * @static
         * @param {c2s.IFrameResp} message FrameResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FrameResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.result != null && message.hasOwnProperty("result"))
                $root.c2s.Result.encode(message.result, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.uid != null && message.hasOwnProperty("uid"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.uid);
            if (message.frameIndex != null && message.hasOwnProperty("frameIndex"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.frameIndex);
            return writer;
        };

        /**
         * Encodes the specified FrameResp message, length delimited. Does not implicitly {@link c2s.FrameResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof c2s.FrameResp
         * @static
         * @param {c2s.IFrameResp} message FrameResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FrameResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FrameResp message from the specified reader or buffer.
         * @function decode
         * @memberof c2s.FrameResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {c2s.FrameResp} FrameResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FrameResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.c2s.FrameResp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.result = $root.c2s.Result.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.uid = reader.string();
                    break;
                case 3:
                    message.frameIndex = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FrameResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof c2s.FrameResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {c2s.FrameResp} FrameResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FrameResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FrameResp message.
         * @function verify
         * @memberof c2s.FrameResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FrameResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.result != null && message.hasOwnProperty("result")) {
                var error = $root.c2s.Result.verify(message.result);
                if (error)
                    return "result." + error;
            }
            if (message.uid != null && message.hasOwnProperty("uid"))
                if (!$util.isString(message.uid))
                    return "uid: string expected";
            if (message.frameIndex != null && message.hasOwnProperty("frameIndex"))
                if (!$util.isInteger(message.frameIndex))
                    return "frameIndex: integer expected";
            return null;
        };

        return FrameResp;
    })();

    c2s.FramesNotify = (function() {

        /**
         * Properties of a FramesNotify.
         * @memberof c2s
         * @interface IFramesNotify
         * @property {Array.<c2s.IFrame>|null} [frame] FramesNotify frame
         */

        /**
         * Constructs a new FramesNotify.
         * @memberof c2s
         * @classdesc Represents a FramesNotify.
         * @implements IFramesNotify
         * @constructor
         * @param {c2s.IFramesNotify=} [properties] Properties to set
         */
        function FramesNotify(properties) {
            this.frame = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FramesNotify frame.
         * @member {Array.<c2s.IFrame>} frame
         * @memberof c2s.FramesNotify
         * @instance
         */
        FramesNotify.prototype.frame = $util.emptyArray;

        /**
         * Creates a new FramesNotify instance using the specified properties.
         * @function create
         * @memberof c2s.FramesNotify
         * @static
         * @param {c2s.IFramesNotify=} [properties] Properties to set
         * @returns {c2s.FramesNotify} FramesNotify instance
         */
        FramesNotify.create = function create(properties) {
            return new FramesNotify(properties);
        };

        /**
         * Encodes the specified FramesNotify message. Does not implicitly {@link c2s.FramesNotify.verify|verify} messages.
         * @function encode
         * @memberof c2s.FramesNotify
         * @static
         * @param {c2s.IFramesNotify} message FramesNotify message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FramesNotify.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.frame != null && message.frame.length)
                for (var i = 0; i < message.frame.length; ++i)
                    $root.c2s.Frame.encode(message.frame[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified FramesNotify message, length delimited. Does not implicitly {@link c2s.FramesNotify.verify|verify} messages.
         * @function encodeDelimited
         * @memberof c2s.FramesNotify
         * @static
         * @param {c2s.IFramesNotify} message FramesNotify message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FramesNotify.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FramesNotify message from the specified reader or buffer.
         * @function decode
         * @memberof c2s.FramesNotify
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {c2s.FramesNotify} FramesNotify
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FramesNotify.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.c2s.FramesNotify();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.frame && message.frame.length))
                        message.frame = [];
                    message.frame.push($root.c2s.Frame.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FramesNotify message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof c2s.FramesNotify
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {c2s.FramesNotify} FramesNotify
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FramesNotify.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FramesNotify message.
         * @function verify
         * @memberof c2s.FramesNotify
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FramesNotify.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.frame != null && message.hasOwnProperty("frame")) {
                if (!Array.isArray(message.frame))
                    return "frame: array expected";
                for (var i = 0; i < message.frame.length; ++i) {
                    var error = $root.c2s.Frame.verify(message.frame[i]);
                    if (error)
                        return "frame." + error;
                }
            }
            return null;
        };

        return FramesNotify;
    })();

    return c2s;
})();

$root.cs = (function() {

    /**
     * Namespace cs.
     * @exports cs
     * @namespace
     */
    var cs = {};

    /**
     * MessageType enum.
     * @name cs.MessageType
     * @enum {string}
     * @property {number} Request=1 Request value
     * @property {number} Response=2 Response value
     * @property {number} Notify=3 Notify value
     * @property {number} Broadcast=4 Broadcast value
     */
    cs.MessageType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[1] = "Request"] = 1;
        values[valuesById[2] = "Response"] = 2;
        values[valuesById[3] = "Notify"] = 3;
        values[valuesById[4] = "Broadcast"] = 4;
        return values;
    })();

    cs.Message = (function() {

        /**
         * Properties of a Message.
         * @memberof cs
         * @interface IMessage
         * @property {number|null} [ID] Message ID
         * @property {number|Long|null} [UID] Message UID
         * @property {string|null} [cmd] Message cmd
         * @property {number|null} [msgType] Message msgType
         * @property {number|null} [seq] Message seq
         * @property {Object.<string,Uint8Array>|null} [options] Message options
         * @property {google.protobuf.IAny|null} [body] Message body
         */

        /**
         * Constructs a new Message.
         * @memberof cs
         * @classdesc Represents a Message.
         * @implements IMessage
         * @constructor
         * @param {cs.IMessage=} [properties] Properties to set
         */
        function Message(properties) {
            this.options = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Message ID.
         * @member {number} ID
         * @memberof cs.Message
         * @instance
         */
        Message.prototype.ID = 0;

        /**
         * Message UID.
         * @member {number|Long} UID
         * @memberof cs.Message
         * @instance
         */
        Message.prototype.UID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Message cmd.
         * @member {string} cmd
         * @memberof cs.Message
         * @instance
         */
        Message.prototype.cmd = "";

        /**
         * Message msgType.
         * @member {number} msgType
         * @memberof cs.Message
         * @instance
         */
        Message.prototype.msgType = 0;

        /**
         * Message seq.
         * @member {number} seq
         * @memberof cs.Message
         * @instance
         */
        Message.prototype.seq = 0;

        /**
         * Message options.
         * @member {Object.<string,Uint8Array>} options
         * @memberof cs.Message
         * @instance
         */
        Message.prototype.options = $util.emptyObject;

        /**
         * Message body.
         * @member {google.protobuf.IAny|null|undefined} body
         * @memberof cs.Message
         * @instance
         */
        Message.prototype.body = null;

        /**
         * Creates a new Message instance using the specified properties.
         * @function create
         * @memberof cs.Message
         * @static
         * @param {cs.IMessage=} [properties] Properties to set
         * @returns {cs.Message} Message instance
         */
        Message.create = function create(properties) {
            return new Message(properties);
        };

        /**
         * Encodes the specified Message message. Does not implicitly {@link cs.Message.verify|verify} messages.
         * @function encode
         * @memberof cs.Message
         * @static
         * @param {cs.IMessage} message Message message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ID != null && message.hasOwnProperty("ID"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.ID);
            if (message.UID != null && message.hasOwnProperty("UID"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.UID);
            if (message.cmd != null && message.hasOwnProperty("cmd"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.cmd);
            if (message.msgType != null && message.hasOwnProperty("msgType"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.msgType);
            if (message.seq != null && message.hasOwnProperty("seq"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.seq);
            if (message.options != null && message.hasOwnProperty("options"))
                for (var keys = Object.keys(message.options), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 6, wireType 2 =*/50).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).bytes(message.options[keys[i]]).ldelim();
            if (message.body != null && message.hasOwnProperty("body"))
                $root.google.protobuf.Any.encode(message.body, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Message message, length delimited. Does not implicitly {@link cs.Message.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cs.Message
         * @static
         * @param {cs.IMessage} message Message message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Message message from the specified reader or buffer.
         * @function decode
         * @memberof cs.Message
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cs.Message} Message
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cs.Message(), key;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.ID = reader.uint32();
                    break;
                case 2:
                    message.UID = reader.uint64();
                    break;
                case 3:
                    message.cmd = reader.string();
                    break;
                case 4:
                    message.msgType = reader.uint32();
                    break;
                case 5:
                    message.seq = reader.uint32();
                    break;
                case 6:
                    reader.skip().pos++;
                    if (message.options === $util.emptyObject)
                        message.options = {};
                    key = reader.string();
                    reader.pos++;
                    message.options[key] = reader.bytes();
                    break;
                case 11:
                    message.body = $root.google.protobuf.Any.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Message message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cs.Message
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cs.Message} Message
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message message.
         * @function verify
         * @memberof cs.Message
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ID != null && message.hasOwnProperty("ID"))
                if (!$util.isInteger(message.ID))
                    return "ID: integer expected";
            if (message.UID != null && message.hasOwnProperty("UID"))
                if (!$util.isInteger(message.UID) && !(message.UID && $util.isInteger(message.UID.low) && $util.isInteger(message.UID.high)))
                    return "UID: integer|Long expected";
            if (message.cmd != null && message.hasOwnProperty("cmd"))
                if (!$util.isString(message.cmd))
                    return "cmd: string expected";
            if (message.msgType != null && message.hasOwnProperty("msgType"))
                if (!$util.isInteger(message.msgType))
                    return "msgType: integer expected";
            if (message.seq != null && message.hasOwnProperty("seq"))
                if (!$util.isInteger(message.seq))
                    return "seq: integer expected";
            if (message.options != null && message.hasOwnProperty("options")) {
                if (!$util.isObject(message.options))
                    return "options: object expected";
                var key = Object.keys(message.options);
                for (var i = 0; i < key.length; ++i)
                    if (!(message.options[key[i]] && typeof message.options[key[i]].length === "number" || $util.isString(message.options[key[i]])))
                        return "options: buffer{k:string} expected";
            }
            if (message.body != null && message.hasOwnProperty("body")) {
                var error = $root.google.protobuf.Any.verify(message.body);
                if (error)
                    return "body." + error;
            }
            return null;
        };

        return Message;
    })();

    return cs;
})();

$root.google = (function() {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    var google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        var protobuf = {};

        protobuf.Any = (function() {

            /**
             * Properties of an Any.
             * @memberof google.protobuf
             * @interface IAny
             * @property {string|null} [type_url] Any type_url
             * @property {Uint8Array|null} [value] Any value
             */

            /**
             * Constructs a new Any.
             * @memberof google.protobuf
             * @classdesc Represents an Any.
             * @implements IAny
             * @constructor
             * @param {google.protobuf.IAny=} [properties] Properties to set
             */
            function Any(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Any type_url.
             * @member {string} type_url
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.type_url = "";

            /**
             * Any value.
             * @member {Uint8Array} value
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.value = $util.newBuffer([]);

            /**
             * Creates a new Any instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny=} [properties] Properties to set
             * @returns {google.protobuf.Any} Any instance
             */
            Any.create = function create(properties) {
                return new Any(properties);
            };

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.type_url);
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
                return writer;
            };

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Any();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.type_url = reader.string();
                        break;
                    case 2:
                        message.value = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Any message.
             * @function verify
             * @memberof google.protobuf.Any
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Any.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    if (!$util.isString(message.type_url))
                        return "type_url: string expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                        return "value: buffer expected";
                return null;
            };

            return Any;
        })();

        return protobuf;
    })();

    return google;
})();