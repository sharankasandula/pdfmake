var app = angular.module('noteApp', ['restangular', 'base64']);

app.config(function(RestangularProvider,$base64) {
    // Add Base url of the file where you can get the notes from
    RestangularProvider.setBaseUrl('https://shdw6b6fe553.int.sap.hana.ondemand.com/hana-070849/');
});



app.controller('mainCtrl', ['$scope', '$log', 'Restangular', '$http',
     function($scope, l, Restangular, $http) {

    Restangular.setFullResponse(true);
    $scope.note = "";
    $scope.notes = [];
    $scope.allTodos = [];
    $scope.triggerError = false;
    
    $scope.generatePDF = function() {
        // 
        var docDefinition={
            content : [],
            style:[],
        };
        docDefinition.header={
            fontSize:15,
            marginLeft:65,
            text: [
                {text:'                   Sharan Kasandula\t', alignment:'left',color:'white'},
                {text: '(+49) 17623725575 | sharankasandula@gmail.com                ',color:'white'}, 
            ],
            background:'#27fff'
        }
        var stuff = [];
        
        docDefinition.content.push(
            {
                columns:[
                    
                    {
                        columns:[
                            [
                                {
                                      marginTop:60,
                                      text:'Sharan Kasandula',
                                      fontSize:23,
                                      color: '#27fff'
                                },
                                {
                                    //   marginTop:0,
                                      text:'Bonhoefferstrasse 13, 513, \n69123 Heidelberg, Germany',
                                      fontSize:10,
                                      italics:true
                                },
                                {
                                      marginTop:6,
                                      text:'Phone: (+49) 17623725575 ',
                                      fontSize:10,
                                      italics:true
                                    //   color: '#27fff'
                                },
                                {
                                    //   marginTop:6,
                                      text:'Email: sharankasandula@gmail.com ',
                                      fontSize:10,
                                      italics:true
                                    //   color: '#27fff'
                                },
                                {   
                                      text:[{text: 'Website: '},{text: 'sharan.website',decoration:'underline', link: ' http://sharan.website/', color: 'blue'}],
                                      fontSize:10,
                                      italics:true
                                },
                            ],
                        
                            {   
                                marginTop:20,
                                alignment:'right',
                                image: 'data:image/jpeg;base64,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',
                            },       
                            
                        ]  
                    },
                    
                    [
                            {
                                marginTop:10,
                                text:'Personal Details',
                                fontSize:15,
                                color: '#27fff'
                                
                            },
                           // HR
                            {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 1 }]},
                            {text:'\n'},
                            {
                                ul: [
                                    'Date of Birth: 30th June 1993',
                                    'Nationality: Indian',
                                    'Marital Status: Single'
                                    ]
                            }
                    ],
                    [
                            {
                                marginTop:20,
                                text:'Work Summary',
                                fontSize:15,
                                color: '#27fff'
                                
                            },
                           // HR
                            {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 1 }]},
                            {text:'\n'},
                            {
                                ul: [
                                    {
                                        text:[{text:'\tInternship at ', color:'#27fff',fontSize:15},{text: 'Carpe Vitam\n', link: 'http://www.carpevit.de/', color:'#27fff',bold:true,fontSize:15}],
                                        // ul: [
                                        //         'skd'
                                        //     ]
                                    },
                                    
                                    'Nationality: Indian',
                                    'Marital Status: Single'
                                    ]
                            }
                    ]
                
                    
                    
                ]
            }
        );

        pdfMake.createPdf(docDefinition).open();
    };

    $scope.deleteNote = function(id) {
        console.log(id);

        var query = 'demo-app-service.xsodata/DATA(' + id + ')';
        Restangular.one(query).remove(id);

        setTimeout(function() {
            $scope.getAllNotes();
        }, 1000);
    }

    var homeUrl = '';

    $scope.getAllNotes = function() {
            Restangular.one('demo-app-service.xsodata/DATA').get().then(function(result){
                $scope.allTodos = result.data.d.results;
            }, function(response){
                console.error("Connection to SAP servers is not possible right now. Please try again later");
                $scope.triggerError = true;
            });
        };



}]);


