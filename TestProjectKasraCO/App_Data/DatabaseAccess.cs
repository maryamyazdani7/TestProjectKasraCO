using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using TestProjectKasraCO.Models;

namespace TestProjectKasraCO.App_Data
{
    public class DatabaseAccess
    {
        private SqlConnection sqlConnection = new SqlConnection();
        private SqlCommand sqlCommand = new SqlCommand();
        private SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
        private DataTable dataTable = new DataTable();

        public DatabaseAccess()
        {
            sqlConnection.ConnectionString = ConfigurationManager.ConnectionStrings["KasraConnection"].ConnectionString;
            sqlCommand.Connection = sqlConnection;
            sqlCommand.Parameters.Clear();
            sqlDataAdapter.SelectCommand = sqlCommand;
        }

        public List<User> UsersList()
        {
            try
            {
                sqlCommand.CommandType = CommandType.Text;
                sqlCommand.CommandText = "select * from dbo.fnUsersList()";

                sqlConnection.Open();
                dataTable = new DataTable();
                sqlDataAdapter.Fill(dataTable);

                return (dataTable.AsEnumerable()
                       .Select(x => new User
                       {
                           Id = x.Field<Int32>("Id"),
                           FirstName = x.Field<string>("FirstName"),
                           LastName = x.Field<string>("LastName"),
                           
                       }).ToList());
            }
            catch (Exception ex) { throw ex; }
            finally { sqlConnection.Close(); }
        }

    }
}