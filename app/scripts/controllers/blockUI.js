angular.module('stockApp').service('blockui', function() {
    this.blockUICall = function() {
        $.blockUI({
            message: 'Getting everything ready.',
            css: {
                border: 'none',
                padding: '15px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: .5,
                color: '#fff'
            }
        });
    }

    this.unblockUICall = function() {
        $.unblockUI();
    }
});
