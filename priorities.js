Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
    Template.body.helpers({
        top_task: function() {
            Meteor.call('getSortedTasks').first;
        },
        tasks: function() {
            return Tasks.find({checked: false}, {skip: 1});
        },
        finished_tasks: function() {
            return Tasks.find({checked: true}, {limit: 5});
        }
    });


    Template.body.events({
        'submit .new-task-form': function(event) {
            event.preventDefault();

            Tasks.insert({
                text: event.target.text.value,
                priority: event.target.priority.value,
                due_date: new Date(event.target.due_date.value),
                created_at: new Date(),
                checked: false
            });

            // Clear the inputs
            event.target.text.value = "";
            event.target.priority.value = "";
            event.target.due_date.value = "";
        }
    });

    Template.task.events({
        'change .check-off': function (event) {
            Tasks.update(this._id, {$set: {checked: ! this.checked}});
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });

    Meteor.methods({
        getSortedTasks: function() {
            tasks = Tasks.find({});

            return tasks.sort(function(a, b) {
                var pri_weight = 0.4;
                var date_weight = 0.6;

                function days_until(date) {
                    return (new Date() - date) / (1000 * 60 * 60 * 24);
                }

                var a_weight = pri_weight * a.priority +
                    date_weight * (days_until(a.due_date));
                var b_weight = pri_weight * b.priority +
                    date_weight * (days_until(b.due_date));

                return a_weight - b_weight;
            });
        }
    })
}
