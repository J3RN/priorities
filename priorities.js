const QUANTA        = 3600000;   // 1 hour
const TIME_PER_DAY  = 28800000;  // 8 hours
const MS_PER_DAY    = 86400000;  // 24 hours

var error_message = '';

if (Meteor.isClient) {
    Template.body.helpers({
        top_task: function() {
            return Tasks.findOne({checked: false}, {sort: {start_date: 1, priority: 1}})
        },
        tasks: function() {
            return Tasks.find({checked: false}, {sort: {start_date: 1, priority: 1}, skip: 1});
        },
        finished_tasks: function() {
            return Tasks.find({checked: true}, {limit: 5});
        },
        sorted_tasks: function() {
            return Tasks.find({checked: false})
        },
        error_message: function() { return error_message; }
    });


    Template.body.events({
        'submit .new-task-form': function(event) {
            event.preventDefault();

            // Calculate ms to completion
            var ms_to_completion = parseInt(event.target.ttc.value) * 3600000;

            // Calculate days needed, multiply by ms per day, and subtract from due date
            var due_date = new Date(event.target.due_date.value);
            var start_date = new Date(due_date - (ms_to_completion / TIME_PER_DAY) * MS_PER_DAY);

            var id = Tasks.insert({
                text: event.target.text.value,
                priority: parseInt(event.target.priority.value),
                due_date: due_date,
                time_to_completion: ms_to_completion,
                start_date: start_date,
                created_at: new Date(),
                checked: false
            }, function(err, result) {
                if (err) {
                    error_message = err;
                    console.log(err);
                }
            });

            console.log(id);

            // Clear the inputs
            event.target.text.value = "";
            event.target.priority.value = "";
            event.target.due_date.value = "";
            event.target.ttc.value = "";
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
}
