/// <reference path="contract.ts" />
/// <reference path="../error.ts" />
/**
 * This module contains one implementation of the Mediator pattern.
 * The Mediator is like a manager, centralizing the communications between elements by notifying events by difrerent channels.
 */
module Good.Patterns.Mediator {
    "use strict";

    type Entry = {
        /**
         * The context for the callback: the 'this' value.
         */
        context: any;
        /**
         * Function which will be called.
         */
        callback: Function;
    };

    export interface IMediator {
        /**
         * Adds a susbcription for the next channel triggered events.
         * @param channel Channel to listen for.
         * @param subscription Function which will be called.
         * @param context The context for the callback: the 'this' value.
         */
        subscribe(channel: string, subscription: Function, context?: any): void;
        /**
         * Publish a change into a channel.
         * @param channel The channel where the change will be published.
         * @param args The args that represents the publish itself.
         */
        publish(channel: string, ...args: any[]): void;
    }

    /**
     * Holds channels and nofities subscribers when someone else publishes anything into a channel.
     */
    export class Group implements IMediator {
        private _hub: {
            [channel: string]: Entry[];
        } = {};

        /**
         * Adds a susbcription for the next channel triggered events.
         * @param channel Channel to listen for.
         * @param subscription Function which will be called.
         * @param context The context for the callback: the 'this' value.
         */
        subscribe(channel: string, subscription: Function, context: any = null) {
            Contract.requires(channel);
            Contract.requires(subscription);
            if (!this._hub[channel]) {
                this._hub[channel] = [];
            }
            this._hub[channel].push({
                callback: subscription,
                context: context
            });
        }

        /**
         * Publish a change into a channel.
         * @param channel The channel where the change will be published.
         * @param args The args that represents the publish itself.
         */
        publish(channel: string, ...args: any[]) {
            var i: number,
                entries: Entry[];

            if (!this._hub[channel]) {
                throw new Error(`No such channel ${channel}`);
            }
            entries = this._hub[channel];
            for (i = 0; i < entries.length; i++) {
                entries[i].callback.apply(entries[i].context, args);
            }
        }

        /**
         * Implements into the target the IMediator interface with this group.
         * @param target The object into which implement the methods.
         */
        attachTo(target: IMediator) {
            Contract.requires(target);
            Contract.requires(!target.subscribe);
            Contract.requires(!target.publish);
            target.subscribe = this.subscribe.bind(this);
            target.publish = this.publish.bind(this);
        }
    }
}