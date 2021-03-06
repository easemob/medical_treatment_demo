"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @ignore
 */
// @ts-ignore
const AgoraRtcChannelModule = uni.requireNativePlugin('Agora-RTC-ChannelModule');
/**
 * @ignore
 */

const Prefix = 'io.agora.rtc.';
/**
 * @ignore
 */
// @ts-ignore

const RtcChannelEvent = uni.requireNativePlugin('globalEvent');
/**
 * @ignore
 */

const channels = new Map();
/**
 * The {@link RtcChannel} class.
 */

class RtcChannel {
  /**
   * The ID of RtcChannel
   */

  /**
   * @ignore
   */

  /**
   * @ignore
   */
  constructor(channelId) {
    _defineProperty(this, "channelId", void 0);

    _defineProperty(this, "_listeners", new Map());

    this.channelId = channelId;
  }
  /**
   * @ignore
   */


  _callMethod(method, args) {
    return new Promise((resolve, reject) => {
      AgoraRtcChannelModule.callMethod({
        method: method,
        args: {
          channelId: this.channelId,
          ...args
        }
      }, res => {
        if (res && res.code) {
          reject(res);
        } else {
          resolve(res);
        }
      });
    });
  }
  /**
   * Creates and gets an [`RtcChannel`]{@link RtcChannel} instance.
   *
   * To join more than one channel, call this method multiple times to create as many `RtcChannel` instances as needed,
   * and call the [`joinChannel`]{@link RtcChannel.joinChannel} method of each created `RtcChannel` object.
   *
   * After joining multiple channels, you can simultaneously subscribe to streams of all the channels, but publish a stream in only one channel at one time.
   * @param channelId The unique channel name for the Agora RTC session in the string format.
   * The string length must be less than 64 bytes.
   * Supported character scopes are:
   * - All lowercase English letters: a to z.
   * - All uppercase English letters: A to Z.
   * - All numeric characters: 0 to 9.
   * - The space character.
   * - Punctuation characters and other symbols, including: "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
   *
   * **Note**
   * - This parameter does not have a default value. You must set it.
   * - Do not set it as the empty string "". Otherwise, the SDK returns [`Refused(-5)`]{@link ErrorCode.Refused}.
   *
   * @returns
   * - An `RtcChannel` instance, if the method call succeeds.
   * - Null, if the method call fails.
   * - [`Refused(-5)`]{@link ErrorCode.Refused}, if you set channelId as the empty string "".
   */


  static async create(channelId) {
    if (channels.get(channelId)) return channels.get(channelId);
    await new Promise((resolve, reject) => {
      AgoraRtcChannelModule.callMethod({
        method: 'create',
        args: {
          channelId: channelId
        }
      }, res => {
        if (res && res.code) {
          reject(res);
        } else {
          resolve(res);
        }
      });
    });
    channels.set(channelId, new RtcChannel(channelId));
    return channels.get(channelId);
  }
  /**
   * Destroys all [`RtcChannel`]{@link RtcChannel} instances.
   */


  static destroyAll() {
    channels.forEach(async value => {
      value.removeAllListeners();
      await value._callMethod('destroy');
    });
    channels.clear();
  }
  /**
   * Destroys the [`RtcChannel`]{@link RtcChannel} instance.
   *
   *  @returns
   * - 0(NoError): Success.
   * - Error codes: Failure.
   *    - 7(NotInitialized): The `RtcChannel` instance is not initialized before calling this method.
   */


  destroy() {
    this.removeAllListeners();
    channels.delete(this.channelId);
    return this._callMethod('destroy');
  }
  /**
   * Adds the [`RtcChannelEvents`]{@link RtcChannelEvents} handler.
   *
   * After setting the [`RtcChannelEvents`]{@link RtcChannelEvents} handler, you can listen for channel events and receive the statistics of the corresponding [`RtcChannel`]{@link RtcChannel} instance.
   * @param event The event type.
   * @param listener The [`RtcChannelEvents`]{@link RtcChannelEvents} handler.
   */


  addListener(event, listener) {
    const callback = res => {
      const {
        channelId,
        data
      } = res;

      if (channelId === this.channelId) {
        // @ts-ignore
        listener(...data);
      }
    };

    let map = this._listeners.get(event);

    if (map === undefined) {
      map = new Map();

      this._listeners.set(event, map);
    }

    RtcChannelEvent.addEventListener(Prefix + event, callback);
    map.set(listener, callback);
    return {
      remove: () => {
        this.removeListener(event, listener);
      }
    };
  }
  /**
   * Removes the [`RtcChannelEvents`]{@link RtcChannelEvents} handler.
   *
   * For callback events that you only want to listen for once, call this method to remove the specific [`RtcEngineEvents`]{@link RtcEngineEvents} objects after you have received them.
   * @param event The event type.
   * @param listener The [`RtcChannelEvents`]{@link RtcChannelEvents} handler.
   */


  removeListener(event, listener) {
    const map = this._listeners.get(event);

    if (map === undefined) return;
    RtcChannelEvent.removeEventListener(Prefix + event, map.get(listener));
    map.delete(listener);
  }
  /**
   * Removes all the [`RtcChannelEvents`]{@link RtcChannelEvents} handlers.
   * @param event The event type.
   */


  removeAllListeners(event) {
    if (event === undefined) {
      this._listeners.forEach((_, key) => {
        RtcChannelEvent.removeAllEventListeners(Prefix + key);
      });

      this._listeners.clear();

      return;
    }

    RtcChannelEvent.removeAllEventListeners(Prefix + event);

    this._listeners.delete(event);
  }
  /**
   * Sets the role of a user in live interactive streaming.
   *
   * You can call this method either before or after joining the channel to set the user role as audience or host. If you call this method to switch the user role after joining the channel, the SDK triggers the following callbacks:
   * - The local client: [`ClientRoleChanged`]{@link RtcChannelEvents.ClientRoleChanged}.
   * - The remote client: [`UserJoined`]{@link RtcChannelEvents.UserJoined} or [`UserOffline(BecomeAudience)`]{@link UserOfflineReason.BecomeAudience}.
   *
   * **Note**
   * - This method applies to the `LiveBroadcasting` profile only (when the `profile` parameter in `setChannelProfile` is set as `LiveBroadcasting`).
   * - As of v3.2.0, this method can set the user level in addition to the user role.
   *    - The user role determines the permissions that the SDK grants to a user, such as permission to send local streams, receive remote streams, and push streams to a CDN address.
   *    - The user level determines the level of services that a user can enjoy within the permissions of the user's role. For example, an audience can choose to receive remote streams with low latency or ultra low latency. **Levels affect prices**.
   *
   * @param role The role of a user in interactive live streaming. See {@link ClientRole}.
   * @param options The detailed options of a user, including user level. See {@link ClientRoleOptions}.
   *
   * @returns
   * - 0(NoError): Success.
   * - Error codes: Failure.
   *    - 1(Failed): A general error occurs (no specified reason).
   *    - 2(InvalidArgument): The parameter is invalid.
   *    - 7(NotInitialized): The SDK is not initialized.
   */


  setClientRole(role, options) {
    return this._callMethod('setClientRole', {
      role,
      options
    });
  }
  /**
   * Joins the channel with a user ID.
   *
   * **Note**
   * - If you are already in a channel, you cannot rejoin it with the same UID.
   * - We recommend using different UIDs for different channels.
   * - If you want to join the same channel from different devices, ensure that the UIDs in all devices are different.
   * - Ensure that the app ID you use to generate the token is the same with the app ID used when creating the [`RtcEngine`]{@link RtcEngine} instance.
   *
   * Once the user joins the channel (switches to another channel), the user subscribes to the audio and video streams of all the other users in the channel by default, giving rise to usage and billing calculation. If you do not want to subscribe to a specified stream or all remote streams, call the `mute` methods accordingly.
   *
   * @param token The token generated at your server.
   * - In situations not requiring high security: You can use the temporary token generated at Console. For details, see [Get a temporary token](https://docs.agora.io/en/Agora%20Platform/token?platform=All%20Platforms#get-a-temporary-token).
   * - In situations requiring high security: Set it as the token generated at your server. For details, see [Generate a token](https://docs.agora.io/en/Agora%20Platform/token?platform=All%20Platforms#generatetoken).
   * @param optionalInfo Additional information about the channel. This parameter can be set as null. Other users in the channel do not receive this information.
   * @param optionalUid The user ID. A 32-bit unsigned integer with a value ranging from 1 to (232-1). This parameter must be unique. If uid is not assigned (or set as 0), the SDK assigns a uid and reports it in the [`JoinChannelSuccess`]{@link RtcChannelEvents.JoinChannelSuccess} callback. The app must maintain this user ID.
   * @param options The channel media options.
   *
   * @returns
   * - 0(NoError): Success.
   * - Error codes: Failure.
   *    - 2(InvalidArgument): The parameter is invalid.
   *    - 3(NotReady): The SDK fails to be initialized. You can try re-initializing the SDK.
   *    - 5(Refused): The request is rejected. Possible reasons:
   *        - You have created an `RtcChannel` object with the same channel name.
   *        - You have joined and published a stream in a channel created by the `RtcChannel` object.
   *    - 7(NotInitialized): The SDK is not initialized.
   */


  joinChannel(token, optionalInfo, optionalUid, options) {
    return this._callMethod('joinChannel', {
      token,
      optionalInfo,
      optionalUid,
      options
    });
  }
  /**
   * Joins a channel with the user account.
   *
   * **Note**
   * - If you are already in a channel, you cannot rejoin it with the same user account.
   * - We recommend using different user accounts for different channels.
   * - If you want to join the same channel from different devices, ensure that the user accounts in all devices are different.
   * - Ensure that the app ID you use to generate the token is the same with the app ID used when creating the [`RtcEngine`]{@link RtcEngine} instance.
   *
   * Once the user joins the channel (switches to another channel), the user subscribes to the audio and video streams of all the other users in the channel by default, giving rise to usage and billing calculation. If you do not want to subscribe to a specified stream or all remote streams, call the `mute` methods accordingly.
   *
   * @param token The token generated at your server.
   * - In situations not requiring high security: You can use the temporary token generated at Console. For details, see [Get a temporary token](https://docs.agora.io/en/Agora%20Platform/token?platform=All%20Platforms#get-a-temporary-token).
   * - In situations requiring high security: Set it as the token generated at your server. For details, see [Generate a token](https://docs.agora.io/en/Agora%20Platform/token?platform=All%20Platforms#generatetoken).
   * @param userAccount The user account. The maximum length of this parameter is 255 bytes. Ensure that you set this parameter and do not set it as null.
   * - All lowercase English letters: a to z.
   * - All uppercase English letters: A to Z.
   * - All numeric characters: 0 to 9.
   * - The space character.
   * - Punctuation characters and other symbols, including: "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
   * @param options The channel media options.
   *
   * @returns
   * - 0(NoError): Success.
   * - Error codes: Failure.
   *    - 2(InvalidArgument): The parameter is invalid.
   *    - 3(NotReady): The SDK fails to be initialized. You can try re-initializing the SDK.
   *    - 5(Refused): The request is rejected.
   */


  joinChannelWithUserAccount(token, userAccount, options) {
    return this._callMethod('joinChannelWithUserAccount', {
      token,
      userAccount,
      options
    });
  }
  /**
   * Leaves the current channel.
   *
   * A successful call of this method triggers the following callbacks:
   * - The local client: [`LeaveChannel`]{@link RtcChannelEvents.LeaveChannel}.
   * - The remote client: [`UserOffline`]{@link RtcChannelEvents.UserOffline}, if the user leaving the channel is in a `Communication` channel, or is a host in a `LiveBroadcasting` channel.
   *
   * @returns
   * - 0(NoError): Success.
   * - Error codes: Failure.
   *    - 1(Failed): A general error occurs (no specified reason).
   *    - 2(InvalidArgument): The parameter is invalid.
   *    - 7(NotInitialized): The SDK is not initialized.
   */


  leaveChannel() {
    return this._callMethod('leaveChannel');
  }
  /**
   * Renews the token when the current token expires.
   *
   * In the following situations, the SDK decides that the current token has expired:
   * - The SDK triggers the [`TokenPrivilegeWillExpire`]{@link RtcChannelEvents.TokenPrivilegeWillExpire} callback, or
   * - The [`ConnectionStateChanged`]{@link RtcChannelEvents.ConnectionStateChanged} callback reports the [`TokenExpired(9)`]{@link ConnectionChangedReason.TokenExpired} error.
   *
   * You should get a new token from your server and call this method to renew it. Failure to do so results in the SDK disconnecting from the Agora server.
   * @param token The new token.
   *
   * @returns
   * - 0(NoError): Success.
   * - Error codes: Failure.
   *    - 1(Failed): A general error occurs (no specified reason).
   *    - 2(InvalidArgument): The parameter is invalid.
   *    - 7(NotInitialized): The SDK is not initialized.
   */


  renewToken(token) {
    return this._callMethod('renewToken', {
      token
    });
  }
  /**
   * Gets the network connection state of the SDK.
   */


  getConnectionState() {
    return this._callMethod('getConnectionState');
  }
  /**
   * Publishes the local stream to the channel.
   *
   * @deprecated TODO(doc)
   *
   * You must keep the following restrictions in mind when calling this method.
   * Otherwise, the SDK returns the [`Refused(-5)`]{@link ErrorCode.Refused}:
   * - This method publishes one stream only to the channel corresponding to the current [`RtcChannel`]{@link RtcChannel} instance.
   * - In a `LiveBroadcasting` channel, only a host can call this method. To switch the client role, call [`setClientRole`]{@link RtcChannel.setClientRole} of the current [`RtcChannel`]{@link RtcChannel} instance.
   * - You can publish a stream to only one channel at a time. For details, see the advanced guide *Join Multiple Channels*.
   */


  publish() {
    return this._callMethod('publish');
  }
  /**
   * Stops publishing a stream to the channel.
   *
   * @deprecated TODO(doc)
   *
   * If you call this method in a channel where you are not publishing streams, the SDK returns [`Refused(-5)`]{@link ErrorCode.Refused}.
   */


  unpublish() {
    return this._callMethod('unpublish');
  }
  /**
   * Gets the current call ID.
   *
   * @returns
   * - The current call ID, if the method call succeeds.
   * - The empty string "", if the method call fails.
   */


  getCallId() {
    return this._callMethod('getCallId');
  }
  /**
   * Adjusts the playback volume of a specified remote user.
   *
   * You can call this method as many times as necessary to adjust the playback volume of different remote
   * users, or to repeatedly adjust the playback volume of the same remote user.
   *
   * **Note**
   * - Call this method after joining a channel.
   * - The playback volume here refers to the mixed volume of a specified remote user.
   * - This method can only adjust the playback volume of one specified remote user at a time.
   * To adjust the playback volume of different remote users, call the method as many times, once for each remote user.
   *
   * @param uid ID of the remote user.
   * @param volume The playback volume of the specified remote user. The value ranges from 0 to 100:
   * - 0: Mute.
   * - 100: The original volume.
   */


  adjustUserPlaybackSignalVolume(uid, volume) {
    return this._callMethod('adjustUserPlaybackSignalVolume', {
      uid,
      volume
    });
  }
  /**
   * Stops/Resumes receiving the audio stream of the specified user.
   *
   * @param uid ID of the remote user whose audio stream you want to mute.
   * @param muted Determines whether to receive/stop receiving the audio stream of the specified user:
   * - `true`: Stop receiving the audio stream of the user.
   * - `false`: (Default) Receive the audio stream of the user.
   */


  muteRemoteAudioStream(uid, muted) {
    return this._callMethod('muteRemoteAudioStream', {
      uid,
      muted
    });
  }
  /**
   * Stops/Resumes receiving all remote audio streams.
   *
   * @param muted Determines whether to receive/stop receiving all remote audio streams:
   * - `true`: Stop receiving all remote audio streams.
   * - `false`: (Default) Receive all remote audio streams.
   */


  muteAllRemoteAudioStreams(muted) {
    return this._callMethod('muteAllRemoteAudioStreams', {
      muted
    });
  }
  /**
   * Sets whether to receive all remote audio streams by default.
   *
   * @deprecated This method is deprecated from v3.3.1.
   *
   * Stops or resumes subscribing to the audio streams of all remote users by default.
   *
   * Call this method after joining a channel. After successfully calling this method, the local user stops or resumes subscribing to the audio streams of all subsequent users.
   *
   * @note
   * If you need to resume subscribing to the audio streams of remote users in the channel after calling `setDefaultMuteAllRemoteAudioStreams(true)`, do the following:
   *   - If you need to resume subscribing to the audio stream of a specified user, call [`muteRemoteAudioStream(false)`]{@link muteRemoteAudioStream}, and specify the user ID.
   *   - If you need to resume subscribing to the audio streams of multiple remote users, call [`muteRemoteAudioStream(false)`]{@link muteRemoteAudioStream} multiple times.
   *
   * @param muted Sets whether to stop subscribing to the audio streams of all remote users by default.
   *              - `true`: Stop subscribing to the audio streams of all remote users by default.
   *              - `false`: (Default) Resume subscribing to the audio streams of all remote users by default.
   *
   */


  setDefaultMuteAllRemoteAudioStreams(muted) {
    return this._callMethod('setDefaultMuteAllRemoteAudioStreams', {
      muted
    });
  }
  /**
   * Stops/Resumes receiving all remote video streams.
   *
   * @param muted Determines whether to receive/stop receiving all remote video streams:
   * - `true`: Stop receiving all remote video streams.
   * - `false`: (Default) Receive all remote video streams.
   */


  muteAllRemoteVideoStreams(muted) {
    return this._callMethod('muteAllRemoteVideoStreams', {
      muted
    });
  }
  /**
   * Stops/Resumes receiving the video stream of the specified user.
   *
   * @param uid ID of the remote user whose video stream you want to mute.
   * @param muted Determines whether to receive/stop receiving the video stream of the specified user:
   * - `true`: Stop receiving the video stream of the user.
   * - `false`: (Default) Receive the video stream of the user.
   */


  muteRemoteVideoStream(uid, muted) {
    return this._callMethod('muteRemoteVideoStream', {
      uid,
      muted
    });
  }
  /**
   * Sets whether to receive all remote video streams by default.
   *
   * @deprecated This method is deprecated from v3.3.1.
   *
   * Stops or resumes subscribing to the video streams of all remote users by default.
   *
   * Call this method after joining a channel. After successfully calling this method, the local user stops or resumes subscribing to the video streams of all subsequent users.
   *
   * @note
   * If you need to resume subscribing to the video streams of remote users in the channel after calling `setDefaultMuteAllRemoteVideoStreams(true)`, do the following:
   *   - If you need to resume subscribing to the video stream of a specified user, call `muteRemoteVideoStream(false)`, and specify the user ID.
   *   - If you need to resume subscribing to the video streams of multiple remote users, call `muteRemoteVideoStream(false)` multiple times.
   *
   * @param muted Sets whether to stop subscribing to the video streams of all remote users by default.
   *              - `true`: Stop subscribing to the video streams of all remote users by default.
   *              - `false`: (Default) Resume subscribing to the video streams of all remote users by default.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */


  setDefaultMuteAllRemoteVideoStreams(muted) {
    return this._callMethod('setDefaultMuteAllRemoteVideoStreams', {
      muted
    });
  }
  /**
   * @ignore
   * Enables/Disables the super-resolution algorithm for a remote user's video stream.
   *
   * @since v3.3.1. (later)
   *
   * The algorithm effectively improves the resolution of the specified remote user's video stream. When the original resolution of the remote video stream is a ?? b pixels, you can receive and render the stream at a higher resolution (2a ?? 2b pixels) by enabling the algorithm.
   *
   * After calling this method, the SDK triggers the [`UserSuperResolutionEnabled`]{@link RtcChannelEvents.UserSuperResolutionEnabled} callback to report whether you have successfully enabled the super-resolution algorithm.
   *
   * @warning
   * The super-resolution algorithm requires extra system resources. To balance the visual experience and system usage, the SDK poses the following restrictions:
   * - The algorithm can only be used for a single user at a time.
   * - On the Android platform, the original resolution of the remote video must not exceed 640 ?? 360 pixels.
   * - On the iOS platform, the original resolution of the remote video must not exceed 640 ?? 480 pixels.
   *
   * If you exceed these limitations, the SDK triggers the `Warning` callback with the corresponding warning codes:
   * - `SuperResolutionStreamOverLimitation(1610)`: The origin resolution of the remote video is beyond the range where the super-resolution algorithm can be applied.
   * - `SuperResolutionUserCountOverLimitation(1611)`: Another user is already using the super-resolution algorithm.
   * - `SuperResolutionDeviceNotSupported(1612)`: The device does not support the super-resolution algorithm.
   *
   * @note
   * Requirements for the user's device:
   * - Android: The following devices are known to support the method:
   *   - VIVO: V1821A, NEX S, 1914A, 1916A, and 1824BA
   *   - OPPO: PCCM00
   *   - OnePlus: A6000
   *   - Xiaomi: Mi 8, Mi 9, MIX3, and Redmi K20 Pro
   *   - SAMSUNG: SM-G9600, SM-G9650, SM-N9600, SM-G9708, SM-G960U, and SM-G9750
   *   - HUAWEI: SEA-AL00, ELE-AL00, VOG-AL00, YAL-AL10, HMA-AL00, and EVR-AN00
   * - iOS: This method is supported on devices running iOS 12.0 or later. The following device models are known to support the method:
   *   - iPhone XR
   *   - iPhone XS
   *   - iPhone XS Max
   *   - iPhone 11
   *   - iPhone 11 Pro
   *   - iPhone 11 Pro Max
   *   - iPad Pro 11-inch (3rd Generation)
   *   - iPad Pro 12.9-inch (3rd Generation)
   *   - iPad Air 3 (3rd Generation)
   * @param uid The ID of the remote user.
   * @param enable Whether to enable the super-resolution algorithm:
   *   - `true`: Enable the super-resolution algorithm.
   *   - `false`: Disable the super-resolution algorithm.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */


  enableRemoteSuperResolution(uid, enable) {
    return this._callMethod('enableRemoteSuperResolution', {
      uid,
      enable
    });
  }
  /**
   * Sets the sound position of a remote user.
   *
   * When the local user calls this method to set the sound position of a remote user, the sound difference between the left and right channels allows the local user to track the real-time position of the remote user, creating a real sense of space. This method applies to massively multiplayer online games, such as Battle Royale games.
   *
   * **Note**
   * - For this method to work, enable stereo panning for remote users by calling the [`enableSoundPositionIndication`]{@link RtcEngine.enableSoundPositionIndication} method before joining a channel.
   * - This method requires hardware support. For the best sound positioning, we recommend using a stereo headset.
   *
   * @param uid The ID of the remote user.
   * @param pan The sound position of the remote user. The value ranges from -1.0 to 1.0:
   * - 0.0: (default) The remote sound comes from the front.
   * - -1.0: The remote sound comes from the left.
   * - 1.0: The remote sound comes from the right.
   * @param gain Gain of the remote user. The value ranges from 0.0 to 100.0. The default value is 100.0 (the original gain of the remote user). The smaller the value, the less the gain.
   */


  setRemoteVoicePosition(uid, pan, gain) {
    return this._callMethod('setRemoteVoicePosition', {
      uid,
      pan,
      gain
    });
  }
  /**
   * Publishes the local stream to a specified CDN streaming URL.
   *
   * After calling this method, you can push media streams in RTMP or RTMPS protocol to the CDN.
   *
   * This method call triggers the [`RtmpStreamingStateChanged`]{@link RtcChannelEvents.RtmpStreamingStateChanged}
   * callback on the local client to report the state of adding a local stream to the CDN.
   *
   * **Note**
   * - Ensure that you enable the RTMP Converter service before using this function. See Prerequisites in *Push Streams to CDN*.
   * - Ensure that the user joins a channel before calling this method.
   * - This method can only be called by a host in a `LiveBroadcasting` channel.
   * - This method adds only one CDN streaming URL each time it is called.
   * - Agora supports pushing media streams in RTMPS protocol to the CDN only when you enable transcoding.
   *
   * @param url The CDN streaming URL in the RTMP or RTMPS format. The maximum length of this parameter is 1024 bytes. The URL address must not contain special characters, such as Chinese language characters.
   * @param transcodingEnabled Whether to enable transcoding. If you set this parameter as true,
   * ensure that you call the [`setLiveTranscoding`]{@link RtcChannel.setLiveTranscoding} method before this method.
   * - `true`: Enable transcoding. To transcode the audio or video streams when publishing them to CDN live, often used for combining the audio and video streams of multiple hosts in CDN live.
   * - `false`: Disable transcoding.
   *
   * @returns
   * - 0(NoError): Success.
   * - Error codes: Failure.
   *    - 2(InvalidArgument): Invalid parameter, usually because the URL address is null or the string length is 0.
   *    - 7(NotInitialized): You have not initialized `RtcEngine` when publishing the stream.
   */


  addPublishStreamUrl(url, transcodingEnabled) {
    return this._callMethod('addPublishStreamUrl', {
      url,
      transcodingEnabled
    });
  }
  /**
   * Removes an RTMP or RTMPS stream from the CDN.
   *
   * This method removes the CDN streaming URL (added by [`addPublishStreamUrl`]{@link RtcChannel.addPublishStreamUrl}) from a CDN live stream.
   * The SDK reports the result of this method call in the [`RtmpStreamingStateChanged`]{@link RtcChannelEvents.RtmpStreamingStateChanged} callback.
   *
   * **Note**
   * - Ensure that you enable the RTMP Converter service before using this function. See Prerequisites in *Push Streams to CDN*.
   * - This method can only be called by a host in a `LiveBroadcasting` channel.
   * - This method removes only one CDN streaming URL each time it is called.
   *
   * @param url The CDN streaming URL to be removed. The maximum length of this parameter is 1024 bytes. The URL address must not contain special characters,
   * such as Chinese language characters.
   */


  removePublishStreamUrl(url) {
    return this._callMethod('removePublishStreamUrl', {
      url
    });
  }
  /**
   * Sets the video layout and audio settings for CDN live.
   *
   * The SDK triggers the [`TranscodingUpdated`]{@link RtcChannelEvents.TranscodingUpdated} callback when you
   * call this method to update the [`LiveTranscoding`]{@link LiveTranscoding} class. If you call this method to set the [`LiveTranscoding`]{@link LiveTranscoding}
   * class for the first time, the SDK does not trigger the [`TranscodingUpdated`]{@link RtcChannelEvents.TranscodingUpdated} callback.
   *
   * **Note**
   * - Ensure that you enable the RTMP Converter service before using this function. See Prerequisites in *Push Streams to CDN*.
   * - Ensure that the user joins a channel before calling this method.
   * - This method can only be called by a host in a `LiveBroadcasting` channel.
   * - Ensure that you call this method before calling the [`addPublishStreamUrl`]{@link RtcChannel.addPublishStreamUrl} method.
   * - Agora supports pushing media streams in RTMPS protocol to the CDN only when you enable transcoding.
   *
   * @param transcoding Sets the CDN live audio/video transcoding settings.
   */


  setLiveTranscoding(transcoding) {
    return this._callMethod('setLiveTranscoding', {
      transcoding
    });
  }
  /**
   * Starts to relay media streams across channels.
   *
   * After a successful method call, the SDK triggers the [`ChannelMediaRelayStateChanged`]{@link RtcChannelEvents.ChannelMediaRelayStateChanged} and [`ChannelMediaRelayEvent`]{@link RtcChannelEvents.ChannelMediaRelayEvent} callbacks,
   * and these callbacks report the state and events of the media stream relay.
   *
   * - If the [`ChannelMediaRelayStateChanged`]{@link RtcChannelEvents.ChannelMediaRelayStateChanged} callback reports [`Running(2)`]{@link ChannelMediaRelayState.Running} and [`None(0)`]{@link ChannelMediaRelayError.None}, and
   * the [`ChannelMediaRelayEvent`]{@link RtcChannelEvents.ChannelMediaRelayEvent} callback
   * reports [`SentToDestinationChannel(4)`]{@link ChannelMediaRelayEvent.SentToDestinationChannel}, the SDK starts relaying media streams between the original and the destination channel.
   *
   * - If the [`ChannelMediaRelayStateChanged`]{@link RtcChannelEvents.ChannelMediaRelayStateChanged} callback returns [`Failure(3)`]{@link ChannelMediaRelayState.Failure}, an exception occurs during the media stream relay.
   *
   * **Note**
   * - Contact support@agora.io before implementing this function.
   * - We do not support string user accounts in this API.
   * - Call this method after joining the channel.
   * - This method can only be called by a host in a `LiveBroadcasting` channel.
   * - After a successful method call, if you want to call this method again, ensure that you call the [`stopChannelMediaRelay`]{@link RtcChannel.stopChannelMediaRelay} method to quit the current relay.
   *
   * @param channelMediaRelayConfiguration The configuration of the media stream relay.
   */


  startChannelMediaRelay(channelMediaRelayConfiguration) {
    return this._callMethod('startChannelMediaRelay', {
      channelMediaRelayConfiguration
    });
  }
  /**
   * Stops the media stream relay.
   *
   * Once the relay stops, the host quits all the destination channels.
   * After a successful method call, the SDK triggers the [`ChannelMediaRelayStateChanged`]{@link RtcChannelEvents.ChannelMediaRelayStateChanged} callback. If the callback reports [`Idle(0)`]{@link ChannelMediaRelayState.Idle} and
   * [`None(0)`]{@link ChannelMediaRelayError.None}, the host successfully stops the relay.
   *
   * **Note**
   * - If the method call fails, the SDK triggers the [`ChannelMediaRelayStateChanged`]{@link RtcChannelEvents.ChannelMediaRelayStateChanged} callback with
   * the [`ServerNoResponse(2)`]{@link ChannelMediaRelayError.ServerNoResponse} or [`ServerConnectionLost(8)`]{@link ChannelMediaRelayError.ServerConnectionLost} state code.
   * You can leave the channel using [`leaveChannel`]{@link RtcChannel.leaveChannel}, and the media stream relay automatically stops.
   */


  stopChannelMediaRelay() {
    return this._callMethod('stopChannelMediaRelay');
  }
  /**
   * Updates the channels for media relay.
   *
   * After the channel media relay starts, if you want to relay the media stream to more channels, or leave the current relay channel, you can call this method.
   * After a successful method call, the SDK triggers the [`ChannelMediaRelayEvent`]{@link RtcChannelEvents.ChannelMediaRelayEvent} callback with
   * the [`UpdateDestinationChannel(7)`]{@link ChannelMediaRelayEvent.UpdateDestinationChannel} state code.
   *
   * **Note**
   * - Call this method after the [`startChannelMediaRelay`]{@link RtcChannel.startChannelMediaRelay} method to update the destination channel.
   * - This method supports adding at most four destination channels in the relay.
   *
   * @param channelMediaRelayConfiguration The media stream relay configuration.
   */


  updateChannelMediaRelay(channelMediaRelayConfiguration) {
    return this._callMethod('updateChannelMediaRelay', {
      channelMediaRelayConfiguration
    });
  }
  /**
   * Sets the default video-stream type of the remote video stream when the remote user sends dual streams.
   *
   * @param streamType Sets the default video-stream type.
   */


  setRemoteDefaultVideoStreamType(streamType) {
    return this._callMethod('setRemoteDefaultVideoStreamType', {
      streamType
    });
  }
  /**
   * Sets the video stream type of the remote video stream when the remote user sends dual streams.
   * This method allows the app to adjust the corresponding video-stream type based on the size of the
   * video window to reduce the bandwidth and resources.
   * - If the remote user enables the dual-stream mode by calling the [`enableDualStreamMode`]{@link RtcEngine.enableDualStreamMode} method,
   * the SDK receives the high-video stream by default. You can use this method to switch to the low-video stream.
   * - If dual-stream mode is not enabled, the SDK receives the high-stream video by default.
   * By default, the aspect ratio of the low-video stream is the same as the high-video stream. Once the resolution of the high-video stream is set,
   * the system automatically sets the resolution, frame rate, and bitrate of the low-video stream.
   *
   * @param uid ID of the remote user sending the video stream.
   * @param streamType Sets the video-stream type.
   */


  setRemoteVideoStreamType(uid, streamType) {
    return this._callMethod('setRemoteVideoStreamType', {
      uid,
      streamType
    });
  }
  /**
   * Sets the priority of a remote user's media stream.
   *
   * Use this method with the [`setRemoteSubscribeFallbackOption`]{@link RtcEngine.setRemoteSubscribeFallbackOption} method.
   * If a remote video stream experiences the fallback, the SDK ensures the high-priority user gets the best possible stream quality.
   *
   * **Note**
   * The Agora SDK supports setting userPriority as high for one user only.
   *
   * @param uid The ID of the remote user.
   * @param userPriority The priority of the remote user.
   */


  setRemoteUserPriority(uid, userPriority) {
    return this._callMethod('setRemoteUserPriority', {
      uid,
      userPriority
    });
  }
  /**
   * Registers the metadata observer.
   *
   * A successful call of this method triggers the [`setMaxMetadataSize`]{@link RtcChannel.setMaxMetadataSize} method.
   *
   * This method enables you to add synchronized metadata in the video stream for more diversified live streaming interactions,
   * such as sending shopping links, digital coupons, and online quizzes.
   *
   * **Note**
   * - Call this method before the [`joinChannel`]{@link RtcChannel.joinChannel} method.
   * - This method applies to the [`LiveBroadcasting`]{@link ChannelProfile.LiveBroadcasting} profile only.
   */


  registerMediaMetadataObserver() {
    return this._callMethod('registerMediaMetadataObserver');
  }
  /**
   * Sends the metadata.
   *
   * @param metadata The metadata to be sent.
   */


  sendMetadata(metadata) {
    return this._callMethod('sendMetadata', {
      metadata
    });
  }
  /**
   * Sets the maximum size of the metadata.
   *
   * @param size Buffer size of the sent or received metadata.
   */


  setMaxMetadataSize(size) {
    return this._callMethod('setMaxMetadataSize', {
      size
    });
  }
  /**
   * Unregisters the metadata observer.
   */


  unregisterMediaMetadataObserver() {
    return this._callMethod('unregisterMediaMetadataObserver');
  }
  /**
   * Enables/Disables the built-in encryption.
   *
   * @since v3.1.2.
   *
   * In scenarios requiring high security, Agora recommends calling `enableEncryption` to enable the built-in encryption before joining a channel.
   *
   * All users in the same channel must use the same encryption mode and encryption key. After a user leaves the channel, the SDK automatically disables the built-in encryption. To enable the built-in encryption, call this method before the user joins the channel again.
   *
   * **Note**
   * If you enable the built-in encryption, you cannot use the RTMP or RTMPS streaming function.
   *
   * @param enabled Whether to enable the built-in encryption.
   * - `true`: Enable the built-in encryption.
   * - `false`: Disable the built-in encryption.
   * @param config Configurations of built-in encryption schemas. See [`EncryptionConfig`]{@link EncryptionConfig}.
   *
   * @returns
   * - 0(NoError): Success.
   * - Error codes: Failure.
   *    - 2(InvalidArgument): An invalid parameter is used. Set the parameter with a valid value.
   *    - 4(NotSupported):  The encryption mode is incorrect or the SDK fails to load the external encryption library. Check the enumeration or reload the external encryption library.
   *    - 7(NotInitialized): The SDK is not initialized. Initialize the `RtcEngine` instance before calling this method.
   */


  enableEncryption(enabled, config) {
    return this._callMethod('enableEncryption', {
      enabled,
      config
    });
  }
  /**
   * Sets the built-in encryption mode.
   *
   * @deprecated
   * Deprecated as of v3.1.2. Use [`enableEncryption`]{@link enableEncryption} instead.
   *
   * The Agora SDK supports built-in encryption, which is set to aes-128-xts mode by default.
   * Call this method to set the encryption mode to use other encryption modes.
   * All users in the same channel must use the same encryption mode and password.
   * Refer to the information related to the AES encryption algorithm on the differences between the encryption modes.
   *
   * **Note**
   * - Do not use this method for CDN streaming.
   * - Before calling this method, ensure that you have called [`setEncryptionSecret`]{@link RtcChannel.setEncryptionSecret} to enable encryption.
   *
   * @param encryptionMode Sets the encryption mode.
   */


  setEncryptionMode(encryptionMode) {
    return this._callMethod('setEncryptionMode', {
      encryptionMode
    });
  }
  /**
   * Enables built-in encryption with an encryption password before joining a channel.
   *
   * @deprecated
   * Deprecated as of v3.1.2. Use [`enableEncryption`]{@link enableEncryption} instead.
   *
   * All users in a channel must set the same encryption password.
   * The encryption password is automatically cleared once a user leaves the channel.
   * If the encryption password is not specified or set to empty, the encryption functionality is disabled.
   *
   * **Note**
   * - For optimal transmission, ensure that the encrypted data size does not exceed the original data size + 16 bytes. 16 bytes is the maximum padding size for AES encryption.
   * - Do not use this method for CDN live streaming.
   *
   * @param secret The encryption password.
   */


  setEncryptionSecret(secret) {
    return this._callMethod('setEncryptionSecret', {
      secret
    });
  }
  /**
   * Injects an online media stream to live interactive streaming.
   *
   * If this method call succeeds, the server pulls the voice or video stream and injects it into a live channel. This applies to scenarios where all audience members in the channel can watch a live show and interact with each other.
   *
   * Calling this method triggers the following callbacks:
   * - The local client:
   *  - [`StreamInjectedStatus`]{@link RtcChannelEvents.StreamInjectedStatus}, with the state of injecting the media stream.
   *  - [`UserJoined`]{@link RtcChannelEvents.UserJoined}(uid: 666), if the method call succeeds and the online
   * media stream is injected into the channel.
   * - The remote client:
   *  - [`UserJoined`]{@link RtcChannelEvents.UserJoined}(uid: 666), if the method call succeeds and the online
   * media stream is injected into the channel.
   *
   * **Warning**
   *
   * Agora will soon stop the service for injecting online media streams on the client. If you have not implemented this service, Agora recommends that you do not use it.
   *
   * **Note**
   * - Ensure that you enable the RTMP Converter service before using this function. See Prerequisites in *Push Streams to CDN*.
   * - This method can only be called by a host in a `LiveBroadcasting` channel.
   *
   * @param url The URL address to be added to the ongoing live interactive streaming. Valid protocols are RTMP, HLS, and FLV.
   * - Supported FLV audio codec type: AAC.
   * - Supported FLV video codec type: H264 (AVC).
   * @param config The [`LiveInjectStreamConfig`]{@link LiveInjectStreamConfig} object, which contains the configuration information for the added voice or video stream.
   *
   * @returns
   * - 0(NoError): Success.
   * - Error codes: Failure.
   *    - 2(InvalidArgument): The injected URL does not exist. Call this method again to inject the stream and ensure that the URL is valid.
   *    - 3(NotReady): The user is not in the channel.
   *    - 4(NotSupported): The channel profile is not `LiveBroadcasting`. Call the `setChannelProfile` method and set the channel profile to `LiveBroadcasting` before calling this method.
   *    - 7(NotInitialized): The SDK is not initialized. Initialize the `RtcEngine` instance before calling this method.
   */


  addInjectStreamUrl(url, config) {
    return this._callMethod('addInjectStreamUrl', {
      url,
      config
    });
  }
  /**
   * Removes the injected online media stream from a `LiveBroadcasting` channel.
   *
   * This method removes the URL address added by [`addInjectStreamUrl`]{@link RtcChannel.addInjectStreamUrl}.
   *
   * If you successfully remove the URL address from the live interactive streaming, the SDK triggers the
   * [`UserJoined`]{@link RtcChannelEvents.UserJoined} callback, with the stream uid of 666.
   *
   * **Warning**
   *
   * Agora will soon stop the service for injecting online media streams on the client. If you have not implemented this service, Agora recommends that you do not use it.
   *
   * @param url The URL address to be removed.
   */


  removeInjectStreamUrl(url) {
    return this._callMethod('removeInjectStreamUrl', {
      url
    });
  }
  /**
   * Creates a data stream.
   *
   * @deprecated
   *
   * This method is deprecated from v3.3.1. Use the [`createDataStreamWithConfig`]{@link createDataStreamWithConfig} method instead.
   *
   * Each user can create up to five data streams during the life cycle of the [`RtcChannel`]{@link RtcChannel} instance.
   *
   * **Note**
   *
   * Set both the `reliable` and `ordered` parameters to `true` or `false`. Do not set one as `true`
   * and the other as `false`.
   * @param reliable Sets whether the recipients are guaranteed to receive the data stream from the
   * sender within five seconds.
   * - `true`: The recipients receive the data from the sender within five seconds. If the recipient does
   * not receive the data within five seconds, the SDK triggers the [`StreamMessageError`]{@link RtcChannelEvents.StreamMessageError} callback and returns an error code.
   * - `false`: There is no guarantee that the recipients receive the data stream within five seconds and no error message is reported for any delay or missing data stream.
   * @param ordered Determines whether the recipients receive the data stream in the sent order.
   * - `true`: The recipients receive the data in the sent order.
   * - `false`: The recipients do not receive the data in the sent order.
   * @returns
   * - Returns the stream ID, if the method call is successful.
   * - Error codes: Failure. The error code is related to the integer displayed in [Error Codes]{@link ErrorCode}.
   */


  createDataStream(reliable, ordered) {
    return this._callMethod('createDataStream', {
      reliable,
      ordered
    });
  }
  /**
   * Creates a data stream.
   *
   * @since v3.3.1.
   *
   * Each user can create up to five data streams in a single channel.
   *
   * This method does not support data reliability. If the receiver receives a data packet five seconds or more after it was sent, the SDK directly discards the data.
   *
   * @param config The configurations for the data stream. See [`DataStreamConfig`]{@link DataStreamConfig}???
   *
   *
   * @return
   * - Returns the stream ID if you successfully create the data stream.
   * - < 0: Fails to create the data stream.
   */


  createDataStreamWithConfig(config) {
    return this._callMethod('createDataStream', {
      config
    });
  }
  /**
   * Sends the data stream message.
   *
   * The SDK has the following restrictions on this method:
   * - Up to 30 packets can be sent per second in a channel with each packet having a maximum size of 1 KB.
   * - Each client can send up to 6 KB of data per second.
   * - Each user can have up to five data channels simultaneously.
   *
   * A successful call of this method triggers the [`StreamMessage`]{@link RtcChannelEvents.StreamMessage} callback on the remote client, from which the remote user gets the stream message.
   *
   * A failed call of this method triggers the [`StreamMessageError`]{@link RtcChannelEvents.StreamMessageError} callback on the remote client.
   *
   * @param streamId ID of the sent data stream returned by the [`createDataStream`]{@link RtcChannel.createDataStream} method.
   *
   * @param message The message data.
   */


  sendStreamMessage(streamId, message) {
    return this._callMethod('sendStreamMessage', {
      streamId,
      message
    });
  }
  /**
   * TODO(doc)
   * @param muted
   */


  muteLocalAudioStream(muted) {
    return this._callMethod('muteLocalAudioStream', {
      muted
    });
  }
  /**
   * TODO(doc)
   * @param muted
   */


  muteLocalVideoStream(muted) {
    return this._callMethod('muteLocalVideoStream', {
      muted
    });
  }

}
/**
 * @ignore
 */


exports.default = RtcChannel;
//# sourceMappingURL=RtcChannel.native.js.map