import {
    sqliteTable,
    index,
    integer,
    text,
    primaryKey,
    blob,
} from 'drizzle-orm/sqlite-core'
import { relations, sql } from 'drizzle-orm'

const NULL = sql`NULL`

export const chatHandleJoin = sqliteTable(
    'chat_handle_join',
    {
        chatId: integer('chat_id').references(() => chat.rowid, {
            onDelete: 'cascade',
        }),
        handleId: integer('handle_id').references(() => handle.rowid, {
            onDelete: 'cascade',
        }),
    },
    (table) => {
        return {
            idxHandleId: index('chat_handle_join_idx_handle_id').on(
                table.handleId
            ),
        }
    }
)

export const handle = sqliteTable('handle', {
    rowid: integer('ROWID').primaryKey({ autoIncrement: true }),
    id: text('id').notNull(),
    country: text('country'),
    service: text('service').notNull(),
    uncanonicalizedId: text('uncanonicalized_id'),
    personCentricId: text('person_centric_id').default(NULL),
})

export const chatMessageJoin = sqliteTable(
    'chat_message_join',
    {
        chatId: integer('chat_id').references(() => chat.rowid, {
            onDelete: 'cascade',
        }),
        messageId: integer('message_id').references(() => message.rowid, {
            onDelete: 'cascade',
        }),
        messageDate: integer('message_date').default(0),
    },
    (table) => {
        return {
            idxMessageDateIdChatId: index(
                'chat_message_join_idx_message_date_id_chat_id'
            ).on(table.chatId, table.messageDate, table.messageId),
            idxChatId: index('chat_message_join_idx_chat_id').on(table.chatId),
            idxMessageIdOnly: index('chat_message_join_idx_message_id_only').on(
                table.messageId
            ),
            pk0: primaryKey(table.chatId, table.messageId),
        }
    }
)

export const message = sqliteTable(
    'message',
    {
        rowid: integer('ROWID').primaryKey({ autoIncrement: true }),
        guid: text('guid').notNull(),
        text: text('text'),
        replace: integer('replace').default(0),
        serviceCenter: text('service_center'),
        handleId: integer('handle_id').default(0),
        subject: text('subject'),
        country: text('country'),
        attributedBody: blob('attributedBody').$type<Uint8Array>(),
        version: integer('version').default(0),
        type: integer('type').default(0),
        service: text('service'),
        account: text('account'),
        accountGuid: text('account_guid'),
        error: integer('error').default(0),
        date: integer('date'),
        dateRead: integer('date_read'),
        dateDelivered: integer('date_delivered'),
        isDelivered: integer('is_delivered').default(0),
        isFinished: integer('is_finished').default(0),
        isEmote: integer('is_emote').default(0),
        isFromMe: integer('is_from_me').default(0),
        isEmpty: integer('is_empty').default(0),
        isDelayed: integer('is_delayed').default(0),
        isAutoReply: integer('is_auto_reply').default(0),
        isPrepared: integer('is_prepared').default(0),
        isRead: integer('is_read').default(0),
        isSystemMessage: integer('is_system_message').default(0),
        isSent: integer('is_sent', { mode: 'boolean' }).default(false),
        hasDdResults: integer('has_dd_results').default(0),
        isServiceMessage: integer('is_service_message').default(0),
        isForward: integer('is_forward').default(0),
        wasDowngraded: integer('was_downgraded').default(0),
        isArchive: integer('is_archive').default(0),
        cacheHasAttachments: integer('cache_has_attachments').default(0),
        cacheRoomnames: text('cache_roomnames'),
        wasDataDetected: integer('was_data_detected').default(0),
        wasDeduplicated: integer('was_deduplicated').default(0),
        isAudioMessage: integer('is_audio_message').default(0),
        isPlayed: integer('is_played').default(0),
        datePlayed: integer('date_played'),
        itemType: integer('item_type').default(0),
        otherHandle: integer('other_handle').default(0),
        groupTitle: text('group_title'),
        groupActionType: integer('group_action_type').default(0),
        shareStatus: integer('share_status').default(0),
        shareDirection: integer('share_direction').default(0),
        isExpirable: integer('is_expirable').default(0),
        expireState: integer('expire_state').default(0),
        messageActionType: integer('message_action_type').default(0),
        messageSource: integer('message_source').default(0),
        associatedMessageGuid: text('associated_message_guid'),
        associatedMessageType: integer('associated_message_type').default(0),
        balloonBundleId: text('balloon_bundle_id'),
        payloadData: blob('payload_data').$type<Uint8Array>(),
        expressiveSendStyleId: text('expressive_send_style_id'),
        associatedMessageRangeLocation: integer(
            'associated_message_range_location'
        ).default(0),
        associatedMessageRangeLength: integer(
            'associated_message_range_length'
        ).default(0),
        timeExpressiveSendPlayed: integer('time_expressive_send_played'),
        messageSummaryInfo: blob('message_summary_info'),
        ckSyncState: integer('ck_sync_state').default(0),
        ckRecordId: text('ck_record_id'),
        ckRecordChangeTag: text('ck_record_change_tag'),
        destinationCallerId: text('destination_caller_id'),
        srCkSyncState: integer('sr_ck_sync_state').default(0),
        srCkRecordId: text('sr_ck_record_id').default(NULL),
        srCkRecordChangeTag: text('sr_ck_record_change_tag').default(NULL),
        isCorrupt: integer('is_corrupt').default(0),
        replyToGuid: text('reply_to_guid').default(NULL),
        sortId: integer('sort_id').default(0),
        isSpam: integer('is_spam').default(0),
        hasUnseenMention: integer('has_unseen_mention').default(0),
        threadOriginatorGuid: text('thread_originator_guid').default(NULL),
        threadOriginatorPart: text('thread_originator_part').default(NULL),
        syndicationRanges: text('syndication_ranges').default(NULL),
        wasDeliveredQuietly: integer('was_delivered_quietly').default(0),
        didNotifyRecipient: integer('did_notify_recipient').default(0),
        syncedSyndicationRanges: text('synced_syndication_ranges').default(
            NULL
        ),
        dateRetracted: integer('date_retracted').default(0),
        dateEdited: integer('date_edited').default(0),
        wasDetonated: integer('was_detonated').default(0),
        partCount: integer('part_count'),
        isStewie: integer('is_stewie').default(0),
        isKtVerified: integer('is_kt_verified').default(0),
    },
    (table) => {
        return {
            idxUndeliveredOneToOneImessage: index(
                'message_idx_undelivered_one_to_one_imessage'
            ).on(
                table.cacheRoomnames,
                table.service,
                table.isSent,
                table.isDelivered,
                table.wasDowngraded,
                table.itemType
            ),
            idxThreadOriginatorGuid: index(
                'message_idx_thread_originator_guid'
            ).on(table.threadOriginatorGuid),
            idxIsSentIsFromMeError: index(
                'message_idx_is_sent_is_from_me_error'
            ).on(table.isSent, table.isFromMe, table.error),
            idxCacheHasAttachments: index(
                'message_idx_cache_has_attachments'
            ).on(table.cacheHasAttachments),
            idxIsReadIsFromMeItemType: index(
                'message_idx_isRead_isFromMe_itemType'
            ).on(table.isRead, table.isFromMe, table.itemType),
            idxFailed: index('message_idx_failed').on(
                table.isFinished,
                table.isFromMe,
                table.error
            ),
            idxIsRead: index('message_idx_is_read').on(
                table.isRead,
                table.isFromMe,
                table.isFinished
            ),
            idxExpireState: index('message_idx_expire_state').on(
                table.expireState
            ),
            idxWasDowngraded: index('message_idx_was_downgraded').on(
                table.wasDowngraded
            ),
            idxOtherHandle: index('message_idx_other_handle').on(
                table.otherHandle
            ),
            idxAssociatedMessage: index('message_idx_associated_message').on(
                table.associatedMessageGuid
            ),
            idxHandleId: index('message_idx_handle_id').on(table.handleId),
            idxHandle: index('message_idx_handle').on(
                table.handleId,
                table.date
            ),
            idxDate: index('message_idx_date').on(table.date),
        }
    }
)

export const chat = sqliteTable(
    'chat',
    {
        rowid: integer('ROWID').primaryKey({ autoIncrement: true }),
        guid: text('guid').notNull(),
        style: integer('style'),
        state: integer('state'),
        accountId: text('account_id'),
        properties: blob('properties'),
        chatIdentifier: text('chat_identifier'),
        serviceName: text('service_name').$type<'iMessage' | 'SMS'>(),
        roomName: text('room_name'),
        accountLogin: text('account_login'),
        isArchived: integer('is_archived').default(0),
        lastAddressedHandle: text('last_addressed_handle'),
        displayName: text('display_name'),
        groupId: text('group_id'),
        isFiltered: integer('is_filtered'),
        successfulQuery: integer('successful_query'),
        engramId: text('engram_id'),
        serverChangeToken: text('server_change_token'),
        ckSyncState: integer('ck_sync_state').default(0),
        originalGroupId: text('original_group_id'),
        lastReadMessageTimestamp: integer(
            'last_read_message_timestamp'
        ).default(0),
        ckRecordSystemPropertyBlob: blob('ck_record_system_property_blob'),
        srServerChangeToken: text('sr_server_change_token'),
        srCkSyncState: integer('sr_ck_sync_state').default(0),
        cloudkitRecordId: text('cloudkit_record_id').default(NULL),
        srCloudkitRecordId: text('sr_cloudkit_record_id').default(NULL),
        lastAddressedSimId: text('last_addressed_sim_id').default(NULL),
        isBlackholed: integer('is_blackholed').default(0),
        syndicationDate: integer('syndication_date').default(0),
        syndicationType: integer('syndication_type').default(0),
        isRecovered: integer('is_recovered').default(0),
    },
    (table) => {
        return {
            idxGroupId: index('chat_idx_group_id').on(table.groupId),
            idxChatIdentifierServiceName: index(
                'chat_idx_chat_identifier_service_name'
            ).on(table.chatIdentifier, table.serviceName),
            idxIsArchived: index('chat_idx_is_archived').on(table.isArchived),
            idxChatRoomNameServiceName: index(
                'chat_idx_chat_room_name_service_name'
            ).on(table.roomName, table.serviceName),
            idxChatIdentifier: index('chat_idx_chat_identifier').on(
                table.chatIdentifier
            ),
        }
    }
)

export const chatRelations = relations(chat, ({ many }) => ({
    messages: many(message), // Assuming a message has a 'chatId' field that references the 'chat' table.
}))
