Tasks = new Mongo.Collection("tasks");

TaskSchema = new SimpleSchema({
    text: {
        type: String,
        label: "Description",
        max: 200
    },
    priority: {
        type: Number,
        label: "Priority",
        min: 1,
        max: 5
    },
    due_date: {
        type: Date,
        label: "Due Date"
    },
    time_to_completion: {
        type: Number,
        label: "Hours to Completion"
    },
    start_date: {
        type: Date,
        label: "Start Date"
    },
    created_at: {
        type: Date,
        label: "Created At"
    },
    checked: {
        type: Boolean,
        label: "Completed"
    }
})

Tasks.attachSchema(TaskSchema);
